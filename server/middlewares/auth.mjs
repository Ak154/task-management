import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authmiddleware = (req, res, next) => {
  try {
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization denied.",
      });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message:
            err.name === "TokenExpiredError"
              ? "Token expired. Please log in again."
              : "Invalid token. Authorization denied.",
        });
      }

      req.user = {
        id: decoded.userId,
        role: decoded.role,
      };

      next();
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};