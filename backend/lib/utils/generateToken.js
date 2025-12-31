import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    }
  );

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,                 // prevents XSS
   // sameSite: "strict",             // prevents CSRF
  sameSite: "none",
secure: true

  });

  return token;
};

export default generateTokenAndSetCookie;
