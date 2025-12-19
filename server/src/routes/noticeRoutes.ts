import { Router } from 'express';
import { 
  getActiveNotices, 
  getAllNotices, 
  createNotice, 
  updateNotice, 
  deleteNotice 
} from '../controllers/noticeController';

const router = Router();

// Frontend Marquee Route
router.get('/', getActiveNotices);

// Admin Routes
router.get('/admin', getAllNotices);
router.post('/', createNotice);
router.put('/:id', updateNotice);
router.delete('/:id', deleteNotice);

export default router;