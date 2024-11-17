const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const ncp = require("ncp").next;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

const corsOptions = {
  origin: "http://localhost:5173", // Replace with the actual front-end URL
  methods: ["GET", "POST"], // Allowed methods
};

app.use(cors(corsOptions));

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Google OAuth2 Client setup
const KEYFILEPATH = "./credentials.json"; // Update with your actual file path
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

// Function to upload the file to Google Drive
async function uploadFile(filePath, name) {
  try {
    const folderId = "1lsE5ReFTnn_qDk5nfjqvhr1XQof_GdNZ"; // Replace with the actual folder ID

    // Determine the mime type based on file extension
    const ext = path.extname(name).toLowerCase();
    let mimeType;

    switch (ext) {
      case ".jpg":
      case ".jpeg":
        mimeType = "image/jpeg";
        break;
      case ".png":
        mimeType = "image/png";
        break;
      case ".gif":
        mimeType = "image/gif";
        break;
      default:
        mimeType = "application/octet-stream"; // Default to binary if the extension is unknown
    }

    const { data } = await drive.files.create({
      media: {
        mimeType: mimeType, // Updated mimeType for images
        body: fs.createReadStream(filePath),
      },
      requestBody: {
        name,
        parents: [folderId], // Folder ID to place the file in
      },
      fields: "id,name",
    });

    console.log("\x1b[100m%s", `\tUploaded file: ${data.name}`, "\x1b[0m");

    let url = `https://drive.google.com/thumbnail?id=${data.id}`;

    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

// Serve the HTML file as the main page
app.use(express.static("public")); // Serve static files (like index.html) from the 'public' folder

// Route to handle file upload
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = path.join(__dirname, req.file.path);
  const fileName = req.file.originalname;

  try {
    // Upload the file to Google Drive
    const url = await uploadFile(filePath, fileName);

    // Delete the file after uploading it to Drive
    fs.unlinkSync(filePath);

    res.status(200).send({ url, message: "File uploaded successfully." });
  } catch (error) {
    res.status(500).send("Error uploading file.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
