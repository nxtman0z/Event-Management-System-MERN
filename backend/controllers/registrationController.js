const Registration = require('../models/Registration');
const Event = require('../models/Event');

/**
 * @desc    Register for an event
 * @route   POST /api/registrations/register/:eventId
 * @access  Private
 */
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Check if event is cancelled
    if (event.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot register for a cancelled event.',
      });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      event: req.params.eventId,
      user: req.user._id,
    });

    if (existingRegistration) {
      if (existingRegistration.status === 'cancelled') {
        // Re-register if previously cancelled
        existingRegistration.status = 'confirmed';
        await existingRegistration.save();

        // Add user back to event's registeredUsers
        if (!event.registeredUsers.includes(req.user._id)) {
          event.registeredUsers.push(req.user._id);
          await event.save();
        }

        return res.json({
          success: true,
          message: 'Successfully re-registered for the event!',
          data: { registration: existingRegistration },
        });
      }

      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event.',
      });
    }

    // Check capacity
    const confirmedCount = await Registration.countDocuments({
      event: req.params.eventId,
      status: 'confirmed',
    });

    let registrationStatus = 'confirmed';
    if (confirmedCount >= event.capacity) {
      registrationStatus = 'waitlisted';
    }

    // Create registration
    const registration = await Registration.create({
      event: req.params.eventId,
      user: req.user._id,
      status: registrationStatus,
    });

    // Add user to event's registeredUsers array
    if (registrationStatus === 'confirmed') {
      event.registeredUsers.push(req.user._id);
      await event.save();
    }

    console.log(`🎫 User ${req.user.name} registered for "${event.title}" (${registrationStatus})`);

    res.status(201).json({
      success: true,
      message:
        registrationStatus === 'waitlisted'
          ? 'Event is full. You have been added to the waitlist.'
          : 'Successfully registered for the event!',
      data: { registration },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during registration.',
    });
  }
};

/**
 * @desc    Cancel registration for an event
 * @route   DELETE /api/registrations/cancel/:eventId
 * @access  Private
 */
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      event: req.params.eventId,
      user: req.user._id,
      status: { $ne: 'cancelled' },
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found.',
      });
    }

    registration.status = 'cancelled';
    await registration.save();

    // Remove user from event's registeredUsers
    await Event.findByIdAndUpdate(req.params.eventId, {
      $pull: { registeredUsers: req.user._id },
    });

    console.log(`❌ User ${req.user.name} cancelled registration for event ${req.params.eventId}`);

    res.json({
      success: true,
      message: 'Registration cancelled successfully.',
    });
  } catch (error) {
    console.error('Cancel registration error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling registration.',
    });
  }
};

/**
 * @desc    Get all events user has registered for
 * @route   GET /api/registrations/my-registrations
 * @access  Private
 */
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user._id,
      status: { $ne: 'cancelled' },
    })
      .populate({
        path: 'event',
        populate: {
          path: 'organizer',
          select: 'name email avatar',
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { registrations },
    });
  } catch (error) {
    console.error('Get my registrations error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

/**
 * @desc    Get all registrations for a specific event
 * @route   GET /api/registrations/event/:eventId
 * @access  Private (admin/organizer of the event)
 */
const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view registrations for this event.',
      });
    }

    const registrations = await Registration.find({
      event: req.params.eventId,
    })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        registrations,
        stats: {
          total: registrations.length,
          confirmed: registrations.filter((r) => r.status === 'confirmed').length,
          cancelled: registrations.filter((r) => r.status === 'cancelled').length,
          waitlisted: registrations.filter((r) => r.status === 'waitlisted').length,
        },
      },
    });
  } catch (error) {
    console.error('Get event registrations error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
};
