import express from 'express';
import Session from '../models/Session.js';
import { validateSession } from '../validators/sessionValidator.js';

const router = express.Router();

// Get all sessions
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const sessions = await Session.find(filter)
      .populate('products')
      .sort({ startTime: -1 });
    
    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
});

// Get live session
router.get('/live', async (req, res, next) => {
  try {
    const session = await Session.findOne({ status: 'live' })
      .populate('products');
    
    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
});

// Get single session
router.get('/:id', async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('products');
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
});

// Create session
router.post('/', async (req, res, next) => {
  try {
    const { error } = validateSession(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const session = await Session.create(req.body);
    await session.populate('products');
    
    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });
  } catch (error) {
    next(error);
  }
});

// Update session status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['scheduled', 'live', 'ended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // End any existing live session if starting a new one
    if (status === 'live') {
      await Session.updateMany(
        { status: 'live' },
        { status: 'ended', endTime: new Date() }
      );
    }

    const updateData = { status };
    if (status === 'ended') {
      updateData.endTime = new Date();
    }

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('products');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: `Session ${status} successfully`,
      data: session
    });
  } catch (error) {
    next(error);
  }
});

// Update session analytics
router.patch('/:id/analytics', async (req, res, next) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { $set: { analytics: req.body } },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
});

// Delete session
router.delete('/:id', async (req, res, next) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
