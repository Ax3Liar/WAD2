// routes/views.js
import { Router } from "express";
import {
  homePage,
  courseDetailPage,
  postBookCourse,
  postBookSession,
  bookingConfirmationPage,
} from "../controllers/viewsController.js";
import { coursesListPage } from "../controllers/coursesListController.js";
import { 
  showDashboard, 
  deleteCourse, 
  showAddForm, 
  createCourse, 
  showEditForm,     // Added
  updateCourse      // Added
} from "../controllers/adminController.js";
import { ensureAuthenticated, isInstructor } from "../middlewares/auth.js";
import { showLoginPage, login, logout } from "../controllers/authController.js";
import { showManageSessions, addSession } from "../controllers/adminController.js";

const router = Router();

// --- PUBLIC ROUTES ---
router.get("/", homePage);
router.get("/courses", coursesListPage);
router.get("/courses/:id", courseDetailPage);

// --- AUTH ROUTES ---
router.get("/login", showLoginPage);
router.post("/login", login);
router.post("/logout", logout); // Changed to POST to match your header form

// --- STUDENT ROUTES ---
router.post("/courses/:id/book", ensureAuthenticated, postBookCourse);
router.post("/sessions/:id/book", ensureAuthenticated, postBookSession);
router.get("/bookings/:bookingId", ensureAuthenticated, bookingConfirmationPage);

// --- INSTRUCTOR ROUTES (Admin CRUD) ---
router.get("/instructor/dashboard", ensureAuthenticated, isInstructor, showDashboard);

// Add Course
router.get("/instructor/courses/add", ensureAuthenticated, isInstructor, showAddForm);
router.post("/instructor/courses/add", ensureAuthenticated, isInstructor, createCourse);

// Edit Course (These were missing)
router.get("/instructor/courses/:id/edit", ensureAuthenticated, isInstructor, showEditForm);
router.post("/instructor/courses/:id/edit", ensureAuthenticated, isInstructor, updateCourse);

// Delete Course
// Note: Changed to /instructor/... to keep it consistent with your dashboard links
router.post("/instructor/courses/:id/delete", ensureAuthenticated, isInstructor, deleteCourse);
router.get("/instructor/courses/:id/participants", ensureAuthenticated, isInstructor, showClassList);
// routes/views.js

// Manage Sessions
router.get("/instructor/courses/:id/sessions", ensureAuthenticated, isInstructor, showManageSessions);
router.post("/instructor/courses/:id/sessions/add", ensureAuthenticated, isInstructor, addSession);

// Class List
router.get("/instructor/courses/:id/participants", ensureAuthenticated, isInstructor, showClassList);

export default router;