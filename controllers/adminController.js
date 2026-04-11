// controllers/adminController.js
import { CourseModel } from "../models/courseModel.js";
import { SessionModel } from "../models/sessionModel.js";
import { BookingModel } from "../models/bookingModel.js";

// 1. Show the Dashboard
export const showDashboard = async (req, res, next) => {
    try {
        const courses = await CourseModel.list();
        res.render("instructor_dashboard", { 
            title: "Instructor Dashboard", 
            courses: courses.map(c => ({
                id: c._id,
                title: c.title,
                type: c.type,
                price: c.price
            }))
        });
    } catch (err) { next(err); }
};

// 2. Show the "Add" Form
export const showAddForm = (req, res) => {
    // UPDATED: Changed 'course_admin' to 'instructor_course_add' to match your file
    res.render("instructor_course_add", { 
        title: "Add New Course", 
        isEdit: false,
        action: "/instructor/courses/add" 
    });
};

// 3. Create a Course
export const createCourse = async (req, res, next) => {
    try {
        const { title, description, level, type, price, location, allowDropIn } = req.body;
        await CourseModel.create({
            title,
            description,
            level,
            type: type || "WEEKLY_BLOCK",
            price: price ? parseFloat(price) : 0,
            location,
            allowDropIn: allowDropIn === "on", 
            instructorId: req.user ? req.user._id : null
        });
        res.redirect("/instructor/dashboard");
    } catch (err) { next(err); }
};

// 4. Show the "Edit" Form
export const showEditForm = async (req, res, next) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        if (!course) return res.status(404).send("Course not found");

        res.render("instructor_course_add", {
            title: "Edit Course",
            isEdit: true,
            course: course,
            action: `/instructor/courses/${course._id}/edit`,
            // Helpers for the dropdowns
            levelBeginner: course.level === 'beginner',
            levelIntermediate: course.level === 'intermediate',
            levelAdvanced: course.level === 'advanced'
        });
    } catch (err) { next(err); }
};

// 5. Handle the Update
export const updateCourse = async (req, res, next) => {
    try {
        const { title, description, level, price, location, allowDropIn } = req.body;
        await CourseModel.update(req.params.id, {
            title,
            description,
            level,
            price: price ? parseFloat(price) : 0,
            location,
            allowDropIn: allowDropIn === "on"
        });
        res.redirect("/instructor/dashboard");
    } catch (err) { next(err); }
};

// 6. Delete a Course
export const deleteCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // 1. Delete the course
        await CourseModel.remove(id);
        
        // 2. Safely try to delete sessions (if the function exists)
        if (SessionModel && typeof SessionModel.removeByCourse === 'function') {
            await SessionModel.removeByCourse(id); 
        }
        
        res.redirect("/instructor/dashboard");
    } catch (err) { 
        console.error("Delete Error:", err);
        res.status(500).send("Could not delete. Check if this course has active bookings.");
    }
    
};

export const showClassList = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await CourseModel.findById(id);
        
        // Find all bookings for this specific course
        const bookings = await BookingModel.findByCourseId(id);
        
        res.render("class_list", { 
            title: "Participant List",
            courseTitle: course.title,
            participants: bookings,
            hasParticipants: bookings.length > 0
        });
    } catch (err) { 
        next(err); 
    }
};

export const showManageSessions = async (req, res, next) => {
    try {
        const { id } = req.params; // Course ID
        const course = await CourseModel.findById(id);
        const sessions = await SessionModel.findByCourseId(id);

        res.render("manage_sessions", {
            title: `Manage Sessions: ${course.title}`,
            courseId: id,
            courseTitle: course.title,
            sessions: sessions
        });
    } catch (err) { next(err); }
};

export const addSession = async (req, res, next) => {
    try {
        const { id } = req.params; // Course ID
        const { date, time, location } = req.body;

        await SessionModel.create({
            courseId: id,
            date,
            time,
            location
        });

        res.redirect(`/instructor/courses/${id}/sessions`);
    } catch (err) { next(err); }
};