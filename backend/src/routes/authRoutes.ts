import express from 'express';
import * as authController from '../controllers/authContoller';
import { protect } from '../middleware/authMiddleware'; // Adjust import path if necessary

const router = express.Router();

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/login-neptun', authController.neptunLogin); // New Neptun login route

// Protected routes
router.use(protect);

router.get('/profile', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

export default router;
