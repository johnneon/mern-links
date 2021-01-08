import { Router, Response } from 'express';
import Request from '../interfaces/auth.user';
import shortid =  require('shortid');
import Link from '../models/Link';
import auth from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', auth, async (req: Request, res: Response) => {
  try {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const { from } = req.body;

    const code = shortid.generate();

    const existing = await Link.findOne({ from });

    if (existing) {
      return res.json({ link: existing });
    }

    const to = baseUrl + '/t/' + code;

    const link = new Link({ code, to, from, owner: req.user.userId });

    await link.save();
    res.status(201).json({ link });
  } catch (e) {
    res.status(500).json({ message: 'Got an error!' });
  }
});

router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: 'Got an error!' });
  }
});

router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (e) {
    res.status(500).json({ message: 'Got an error!' });
  }
});

export default router;