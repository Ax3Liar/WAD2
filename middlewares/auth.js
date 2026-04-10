// middlewares/auth.js

/**
 * Ensures a user is logged in.
 * If not, redirects to the login page.
 */
export const ensureAuthenticated = (req, res, next) => {
    // Check if req.user exists (set by your login logic/cookies)
    if (req.user) {
        return next();
    }
    // If not logged in, send them to login with a message
    res.status(401).render("login", { 
        title: "Login Required", 
        error: "Please log in to access this page." 
    });
};

/**
 * Ensures the logged-in user is an Instructor.
 * Use this for Dashboard, Adding, and Deleting courses.
 */
export const isInstructor = (req, res, next) => {
    // We assume ensureAuthenticated has already run, or we check both
    if (req.user && req.user.role === 'instructor') {
        return next();
    }
    
    // If they are a student trying to access admin pages
    res.status(403).render("error", { 
        title: "Access Denied", 
        message: "You do not have permission to view this instructor area." 
    });
};