import { UserModel } from "../models/userModel.js";

// 1. Show the Login Page
export const showLoginPage = (req, res) => {
  res.render("login", { title: "Login" });
};

// 2. Handle Login Logic
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findByEmail(email);

    // Check if user exists AND password matches
    // NOTE: In a real app, use bcrypt.compare(password, user.password)
    if (!user || user.password !== password) {
      return res.render("login", {
        title: "Login",
        error: "Invalid email or password.",
        email: email, // Keep email in the box for convenience
      });
    }

    // SUCCESS: Store the User ID in a cookie
    // 'httpOnly' prevents hackers from stealing it via browser scripts
    res.cookie("userId", user._id, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    // Redirect based on role
    if (user.role === "instructor") {
      res.redirect("/instructor/dashboard");
    } else {
      res.redirect("/courses");
    }
  } catch (err) {
    next(err);
  }
};

// 3. Handle Logout
export const logout = (req, res) => {
  res.clearCookie("userId");
  res.redirect("/");
};