const Photo = require("../models/Photo");
const {
    streamUpload,
    deleteFromCloudinary
} = require("../util/cloudinary");


// GET /api/photos
const getPhotos = async (req, res) => {
    try {
        const photos = await Photo.find()
            .populate("owner", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json(photos);

    } catch (error) {
        res.status(500).json({
            message: "Server error while retrieving photos.",
            error: error.message
        });
    }
};


// GET /api/photos/all
const getAllPhotos = async (req, res) => {
    try {
        const photos = await Photo.find()
            .populate("owner", "username email role")
            .sort({ createdAt: -1 });

        res.status(200).json(photos);

    } catch (error) {
        res.status(500).json({
            message: "Server error while retrieving all photos.",
            error: error.message
        });
    }
};


// POST /api/photos
const uploadPhoto = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Photo title is required."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "An image file is required."
            });
        }

        const uploadResult = await streamUpload(req.file.buffer);

        const photo = await Photo.create({
            title,
            description,
            imageUrl: uploadResult.secure_url,
            cloudinaryPublicId: uploadResult.public_id,
            owner: req.user._id
        });

        const populatedPhoto = await photo.populate(
            "owner",
            "username email"
        );

        res.status(201).json({
            message: "Photo uploaded successfully.",
            photo: populatedPhoto
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error while uploading photo.",
            error: error.message
        });
    }
};


// PUT /api/photos/:photoId
const updatePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.photoId);

        if (!photo) {
            return res.status(404).json({
                message: "Photo not found."
            });
        }

        const isOwner =
            photo.owner.toString() === req.user._id.toString();

        const isAdmin =
            req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "You are not authorised to update this photo."
            });
        }

        if (req.body.title) {
            photo.title = req.body.title;
        }

        if (req.body.description !== undefined) {
            photo.description = req.body.description;
        }

        if (req.file) {
            const oldPublicId = photo.cloudinaryPublicId;

            const uploadResult = await streamUpload(req.file.buffer);

            photo.imageUrl = uploadResult.secure_url;
            photo.cloudinaryPublicId = uploadResult.public_id;

            await photo.save();

            await deleteFromCloudinary(oldPublicId);

        } else {
            await photo.save();
        }

        const populatedPhoto = await photo.populate(
            "owner",
            "username email"
        );

        res.status(200).json({
            message: "Photo updated successfully.",
            photo: populatedPhoto
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error while updating photo.",
            error: error.message
        });
    }
};


// DELETE /api/photos/:photoId
const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.photoId);

        if (!photo) {
            return res.status(404).json({
                message: "Photo not found."
            });
        }

        const isOwner =
            photo.owner.toString() === req.user._id.toString();

        const isAdmin =
            req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "You are not authorised to delete this photo."
            });
        }

        await deleteFromCloudinary(photo.cloudinaryPublicId);

        await photo.deleteOne();

        res.status(200).json({
            message: "Photo deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error while deleting photo.",
            error: error.message
        });
    }
};


module.exports = {
    getPhotos,
    getAllPhotos,
    uploadPhoto,
    updatePhoto,
    deletePhoto
};