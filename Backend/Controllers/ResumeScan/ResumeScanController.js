const { getResumeFeedback } = require("../../Middleware/getResumeFeedback");
const { extractTextFromFile } = require("../../Middleware/extractTextFromFile");

module.exports.ResumeScan = async (req, res) => {
  try {
    const ALLOWED_MIMES = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const mime = req.file.mimetype || mimeLookup(req.file.originalname);
    if (!ALLOWED_MIMES.includes(mime))
      return res.status(400).json({ error: "PDF, DOC, DOCX only" });

    const text = await extractTextFromFile(req.file.buffer, mime);
    if (!text || text.trim().length < 20)
      return res.status(422).json({ error: "Could not extract text" });

    const feedback = await getResumeFeedback(text); // <-- independent feedback
    res.json({ ok: true, mime, charCount: text.length, feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed", message: err.message });
  }
};
