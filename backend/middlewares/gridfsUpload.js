// const { MongoClient, GridFSBucket } = require('mongodb');
// const multer = require('multer');
// const crypto = require('crypto');
// const path = require('path');
// const dotenv = require('dotenv');
// const stream = require('stream');

// dotenv.config();

// const uri = process.env.MONGO_ATLAS_URI_AGENCY;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// let bucket;

// // Initialize MongoDB connection and GridFSBucket
// const dbReady = client.connect().then(() => {
//     const db = client.db(); // Uses the default DB from URI
//     bucket = new GridFSBucket(db, { bucketName: 'uploads' });
//     console.log("✅ GridFSBucket is ready");
// });

// // Multer setup for in-memory file handling
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Helper to get bucket safely
// const getBucket = () => {
//     if (!bucket) throw new Error("❌ GridFS bucket not initialized yet. Wait for dbReady.");
//     return bucket;
// };

// // Merged upload function supporting mimetype
// const uploadToGridFS = async(fileBuffer, originalname, mimetype = null) => {
//     const filename = crypto.randomBytes(16).toString('hex') + path.extname(originalname);
//     const bucket = getBucket();

//     const bufferStream = new stream.PassThrough();
//     bufferStream.end(fileBuffer);

//     return new Promise((resolve, reject) => {
//         const options = {
//             metadata: { uploadedAt: new Date() }
//         };
//         if (mimetype) options.contentType = mimetype;

//         const uploadStream = bucket.openUploadStream(filename, options);

//         bufferStream.pipe(uploadStream)
//             .on('error', reject)
//             .on('finish', () => {
//                 resolve({
//                     fileId: uploadStream.id,
//                     filename: uploadStream.filename
//                 });
//             });
//     });
// };

// module.exports = {
//     upload,
//     uploadToGridFS,
//     dbReady,
//     getBucket
// };




const { MongoClient, GridFSBucket } = require('mongodb');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');
const stream = require('stream');

dotenv.config();

// MongoDB connection
const uri = process.env.MONGO_ATLAS_URI_AGENCY;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let bucket;

// Initialize GridFSBucket once DB is ready
const dbReady = client.connect().then(() => {
    const db = client.db(); // default DB from URI
    bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    console.log("✅ GridFSBucket is ready");
});

// Multer config: in-memory + allow only videos (mp4, mov, avi, etc.)
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'video/mp4',
            'video/mpeg',
            'video/quicktime',
            'video/x-msvideo'
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('❌ Only video files (mp4, mpeg, mov, avi) are allowed!'), false);
        }
    },
    limits: {
        fileSize: 200 * 1024 * 1024 // optional: limit to 200MB
    }
});

// Helper to safely get bucket
const getBucket = () => {
    if (!bucket) throw new Error("❌ GridFS bucket not initialized yet. Wait for dbReady.");
    return bucket;
};

// Upload buffer to GridFS with correct mimetype
const uploadToGridFS = async(fileBuffer, originalname, mimetype = null) => {
    const filename = crypto.randomBytes(16).toString('hex') + path.extname(originalname);
    const bucket = getBucket();

    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    return new Promise((resolve, reject) => {
        const options = {
            metadata: { uploadedAt: new Date() }
        };
        if (mimetype) options.contentType = mimetype;

        const uploadStream = bucket.openUploadStream(filename, options);

        bufferStream.pipe(uploadStream)
            .on('error', reject)
            .on('finish', () => {
                resolve({
                    fileId: uploadStream.id,
                    filename: uploadStream.filename
                });
            });
    });
};

module.exports = {
    upload,
    uploadToGridFS,
    dbReady,
    getBucket
};