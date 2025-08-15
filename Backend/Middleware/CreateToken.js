const { EncryptJWT } = require("jose");
const encoder = new TextEncoder();

async function CreateToken(userId, role, email, name) {
  const raw = process.env.SECRET_KEY.slice(0, 32); // Ensure 32 bytes for A256GCM(Algorithm for encryption)
  const secret = encoder.encode(raw);

  console.log("Call Receive in JWE");

  // Payload with all required fields
  const payload = {
    userId,
    role,
    email,
    name,
  };

  const jwe = await new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("3d") // 3 days
    .encrypt(secret);

  console.log("From JWE: Call DONE");
  return jwe;
}

module.exports = CreateToken;
