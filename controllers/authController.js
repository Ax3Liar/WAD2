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

export const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    
    // Simple check
    if (!email || !password) {
      return res.render("register", { error: "Email and password required" });
    }

    // Create the user (ensure your UserModel has a .create method)
    await UserModel.create({ 
      email, 
      password, 
      role: role || "student" // Default to student if not provided
    });

    // Redirect to login after successful registration
    res.redirect("/login?registered=true");
  } catch (err) {
    res.render("register", { error: "User already exists or data is invalid" });
  }
};

// 3. Handle Logout
export const logout = (req, res) => {
  res.clearCookie("userId");
  res.redirect("/");
};

// 4. Show the Registration Page 
export const showRegisterPage = (req, res) => {
    res.render("register", { title: "Register" });
};