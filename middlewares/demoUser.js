// middlewares/demoUser.js
import { UserModel } from "../models/userModel.js";

export const attachDemoUser = async (req, res, next) => {
  try {
    // 1. Try to find a real logged-in user via cookie
    const userId = req.cookies.userId;

    if (userId) {
      const user = await UserModel.findById(userId);
      if (user) {
        req.user = user;
        res.locals.user = user;
        res.locals.isInstructor = user.role === "instructor";
        return next();
      }
    }

    // 2. FALLBACK: If no cookie is found, use your demo student
    // (This keeps your site working while you finish the login form)
    const email = "fiona@student.local";
    let user = await UserModel.findByEmail(email);
    
    if (!user) {
       user = await UserModel.create({ 
         name: "Fiona", email, password: "password123", role: "instructor" 
       });
    }

    req.user = user;
    res.locals.user = user;
    res.locals.isInstructor = user.role === "instructor";
    
    next();
  } catch (err) {
    next(err);
  }
};