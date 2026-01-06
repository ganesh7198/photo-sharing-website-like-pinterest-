import jwt from "jsonwebtoken";
const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId} , process.env.JWT_SECRET, { expiresIn: "15d" });
  
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "lax", // works for localhost
    secure: false    // must be false for HTTP
  });

  return token;
};
export default generateTokenAndSetCookie;