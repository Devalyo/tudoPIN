import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { home, publishPage, loginPage, signupPage } from '../controllers/getControllers.js';
import { loadMoreImages } from '../controllers/postControllers.js';

const router = Router();

router.get('/', home);
router.get('/publish', requireAuth, publishPage);
router.get('/login', loginPage);
router.get('/signup', signupPage);
router.get('/api/images', loadMoreImages);

export default router;
