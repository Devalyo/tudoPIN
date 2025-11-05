import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { publish, toggleLike } from '../controllers/postControllers.js';

const router = Router();

router.post('/publish', requireAuth, publish);
router.post('/images/:id/like', requireAuth, toggleLike);


export default router;
