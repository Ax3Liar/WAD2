// middlewares/auth.js
import { UserModel } from "../models/userModel.js";
import { showLoginPage, login, logout, showRegisterPage } from '../controllers/authController.js';

export const ensureAuthenticated = async (req, res, next) => {
    const userId = req.cookies.userId;

    if (!userId) {
        return res.status(401).render("login", { 
            title: "Login Required", 
            error: "Please log in to access this page." 
        });
    }

    try {
        const user = await UserModel.findById(userId);
        
        if (!user) {
            res.clearCookie("userId");
            return res.redirect("/auth/login");
        }

        
        req.user = user; 
        next();
    } catch (err) {
        next(err);
    }
};

export const isInstructor = (req, res, next) => {
    if (req.user && req.user.role === 'instructor') {
        return next();
    }
    
    res.status(403).render("error", { 
        title: "Access Denied", 
        message: "You do not have permission to view this instructor area." 
    });
};
