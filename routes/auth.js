// routes/auth.js
import express from 'express';
// Add 'register' to the list below!
import { 
  showLoginPage, 
  login, 
  logout, 
  showRegisterPage, 
  register 
} from '../controllers/authController.js';

const router = express.Router();

router.get('/login', showLoginPage);
router.post('/login', login);

router.get('/register', showRegisterPage); // This shows the form
router.post('/register', register);         // This handles the form submit

router.post('/logout', logout);

export default router;