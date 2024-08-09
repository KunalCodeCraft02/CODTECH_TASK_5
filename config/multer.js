const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destPath = path.join(__dirname, '../public/instadp/img');
        cb(null, destPath);
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, bytes) {
            if (err) {
                console.error('Error generating filename:', err);
                return cb(err);
            }
            const fn = bytes.toString("hex") + path.extname(file.originalname);
            cb(null, fn);
        });
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
