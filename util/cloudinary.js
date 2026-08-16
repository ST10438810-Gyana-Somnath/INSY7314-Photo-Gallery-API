const { v2: cloudinary } = require("cloudinary");
const stream = require("stream");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: "securephoto"
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        bufferStream.pipe(uploadStream);
    });
};

const deleteFromCloudinary = async (publicId) => {
    await cloudinary.uploader.destroy(publicId);
};

module.exports = {
    streamUpload,
    deleteFromCloudinary
};