// // gridfs.js
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

// const dbReady = client.connect().then(() => {
//     const db = client.db(); // uses default DB from URI
//     bucket = new GridFSBucket(db, { bucketName: 'uploads' });
//     console.log("✅ GridFSBucket ready");
// });

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const uploadToGridFS = async(buffer, originalname, mimetype) => {
//     const bucket = getBucket();
//     return new Promise((resolve, reject) => {
//         const uploadStream = bucket.openUploadStream(originalname, {
//             contentType: mimetype,
//             metadata: { uploadedAt: new Date() }
//         });

//         uploadStream.end(buffer, (err) => {
//             if (err) return reject(err);
//             resolve({ fileId: uploadStream.id, filename: uploadStream.filename });
//         });
//     });
// // };


// const uploadToGridFS = async(fileBuffer, originalname) => {
//     const filename = crypto.randomBytes(16).toString('hex') + path.extname(originalname);
//     const uploadStream = bucket.openUploadStream(filename);
//     const bufferStream = new stream.PassThrough();
//     bufferStream.end(fileBuffer);

//     return new Promise((resolve, reject) => {
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
//     getBucket: () => bucket, // 💡 this gives access to the initialized bucket
// };






const { MongoClient, GridFSBucket } = require('mongodb');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');
const stream = require('stream');

dotenv.config();

const uri = process.env.MONGO_ATLAS_URI_AGENCY;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let bucket;

// Initialize MongoDB connection and GridFSBucket
const dbReady = client.connect().then(() => {
    const db = client.db(); // Uses the default DB from URI
    bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    console.log("✅ GridFSBucket is ready");
});

// Multer setup for in-memory file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to get bucket safely
const getBucket = () => {
    if (!bucket) throw new Error("❌ GridFS bucket not initialized yet. Wait for dbReady.");
    return bucket;
};

// Merged upload function supporting mimetype
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