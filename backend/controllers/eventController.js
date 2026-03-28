const Event = require('../models/Event');
const { validationResult } = require('express-validator');

/**
 * @desc    Get all events with filters
 * @route   GET /api/events
 * @access  Public
 */
const getEvents = async (req, res) => {
  try {
    const { category, status, search, startDate, endDate, isFree, page = 1, limit = 12 } = req.query;

    // Build filter object
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (isFree !== undefined) {
      filter.isFree = isFree === 'true';
    }

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Text search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [events, total] = await Promise.all([
      Event.find(filter)
        .populate('organizer', 'name email avatar')
        .sort({ date: 1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Event.countDocuments(filter),
    ]);

    console.log(`📋 Fetched ${events.length} events (page ${page})`);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get events error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching events.',
    });
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar role')
      .populate('registeredUsers', 'name avatar');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    res.json({
      success: true,
      data: { event },
    });
  } catch (error) {
    console.error('Get event error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (organizer/admin)
 */
const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const eventData = {
      ...req.body,
      organizer: req.user._id,
    };

    // Handle tags - convert from comma-separated string to array
    if (typeof eventData.tags === 'string') {
      eventData.tags = eventData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }

    // Set isFree based on ticketPrice
    if (eventData.ticketPrice && eventData.ticketPrice > 0) {
      eventData.isFree = false;
    }

    // Handle uploaded banner image
    if (req.file) {
      eventData.bannerImage = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create(eventData);
    await event.populate('organizer', 'name email avatar');

    console.log(`🎉 New event created: "${event.title}" by ${req.user.name}`);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event },
    });
  } catch (error) {
    console.error('Create event error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error creating event.',
    });
  }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private (owner only)
 */
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Check ownership (allow admin to edit any event)
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event.',
      });
    }

    const updateData = { ...req.body };

    // Handle tags
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }

    // Set isFree based on ticketPrice
    if (updateData.ticketPrice !== undefined) {
      updateData.isFree = updateData.ticketPrice <= 0;
    }

    // Handle uploaded banner image
    if (req.file) {
      updateData.bannerImage = `/uploads/${req.file.filename}`;
    }

    event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('organizer', 'name email avatar');

    console.log(`✏️ Event updated: "${event.title}"`);

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event },
    });
  } catch (error) {
    console.error('Update event error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error updating event.',
    });
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private (owner only)
 */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event.',
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Also delete all registrations for this event
    const Registration = require('../models/Registration');
    await Registration.deleteMany({ event: req.params.id });

    console.log(`🗑️ Event deleted: "${event.title}"`);

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error deleting event.',
    });
  }
};

/**
 * @desc    Get events created by logged in user
 * @route   GET /api/events/my-events
 * @access  Private
 */
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
      .populate('organizer', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { events },
    });
  } catch (error) {
    console.error('Get my events error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
};
