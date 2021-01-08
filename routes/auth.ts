import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import User from '../models/User';
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');
const router = Router();

router.post(
  '/register',
  [
    check('email', 'Incorect email!').isEmail(),
    check('password', 'Minimum number of characters 6!').isLength({ min: 6 }),
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!(errors.isEmpty())) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorect data!',
      })
    }
    
    const { email, password } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      return res.status(400).json({ message: 'This user has been registered!' })
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: 'User created!' });

  } catch (e) {
    res.status(500).json({ message: 'Got an error!' });
  }
});

router.post(
  '/login',
  [
    check('email', 'Incorect email!').normalizeEmail().isEmail(),
    check('password', 'Incorect password!').exists(),
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!(errors.isEmpty())) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorect data!',
      })
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User is not found!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.status(400).json({ message: 'Incorect password!' })
    }

    const secret = process.env.JWT_SECRET || 'lichttestproject';

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });

    res.json({ token, userId: user.id });
    
  } catch (e) {
    res.status(500).json({ message: 'Got an error!' });
  }
});

export default router;