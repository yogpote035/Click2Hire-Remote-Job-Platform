const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const textract = require("textract");

async function extractTextFromFile(buffer, mime) {
  if (mime === "application/pdf") {
    const { text } = await pdf(buffer);
    return text || "";
  }
  if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const { value } = await mammoth.extractRawText({ buffer });
    return value || "";
  }
  if (mime === "application/msword") {
    return new Promise((resolve, reject) => {
      textract.fromBufferWithName("resume.doc", buffer, (err, text) => {
        if (err) reject(err);
        else resolve(text || "");
      });
    });
  }
  throw new Error("Unsupported file type");
}

module.exports = { extractTextFromFile };
