const { jwtDecrypt } = require("jose");
const encoder = new TextEncoder();

async function VerifyToken(req, res, next) {
  try {
    console.log("VerifyToken Middleware: Start");
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const raw = process.env.SECRET_KEY.slice(0, 32);
    const secret = encoder.encode(raw);

    const { payload } = await jwtDecrypt(token, secret);

    req.user = payload; // token info in req.user for use in controllers
    next(); //call next middleware or route handler
    console.log("VerifyToken Middleware: Done");
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = VerifyToken;
