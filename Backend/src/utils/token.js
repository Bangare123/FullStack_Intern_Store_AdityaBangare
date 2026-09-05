const crypto = require("crypto");

const secret = process.env.AUTH_SECRET;

function createToken(user) {
  const payload = {
    id: user.id,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );

  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  try {
    const parts = token.split(".");

    if (parts.length !== 2) {
      return null;
    }

    const [encodedPayload, signature] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(encodedPayload)
      .digest("base64url");

    
    if (signature.length !== expectedSignature.length) {
      return null;
    }

    const valid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );

    if (!valid) {
      return null;
    }

    const data = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    );

    if (!data.exp || data.exp < Date.now()) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Token verification error:", error.message);
    return null;
  }
}

module.exports = {
  createToken,
  verifyToken,
};
