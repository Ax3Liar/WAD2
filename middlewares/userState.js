import { UserModel } from "../models/userModel.js";

export const loadUser = async (req, res, next) => {
    const userId = req.cookies.userId;
    if (userId) {
        try {
            const user = await UserModel.findById(userId);
            if (user) {
                req.user = user;
                // res.locals makes these variables available to MUSTACHE automatically
                res.locals.user = user;
                res.locals.name = user.username || user.email;
                res.locals.role = user.role;
                res.locals.isInstructor = user.role === 'instructor';
            }
        } catch (err) {
            console.error("User state error:", err);
        }
    }
    next();
};