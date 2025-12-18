import User from "../models/user.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }
  try {
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(409)
        .json({ message: "User already exist", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "Account created successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error while creating user",
      success: false,
      error,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "All field are required", success: false });
  }
  try {
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .json({ message: "Loggedin successfully", success: true, token });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error while logging",
      success: false,
      error,
    });
  }
};

export const userinfo = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id).select("name role _id");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "User found successfully", success: true, data:user });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error while getting user info",
      success: false,
    });
  }
};

export const usersList = async (req, res) => {
  try {
    const users = await User.find({role: "user"}).select("name role _id");
    if (!users) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "User found successfully", success: true, data:users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error while getting user info",
      success: false,
    });
  }
};