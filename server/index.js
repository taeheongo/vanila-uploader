const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file:", file);
    cb(null, __dirname + "/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".")[1]
    );
  },
});

const upload = multer({
  storage,
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/upload", upload.any(), (req, res) => {
  console.log("req.files:", req.files);
  res.json({ success: true, data: { url: req.files[0].path } });
});

app.listen(5000, () => {
  console.log("listening on 5000");
});
