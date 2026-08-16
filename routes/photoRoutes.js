const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    getPhotos,
    getAllPhotos,
    uploadPhoto,
    updatePhoto,
    deletePhoto
} = require("../controllers/photoController");


router.get("/", protect, getPhotos);

router.get(
    "/all",
    protect,
    adminOnly,
    getAllPhotos
);

router.post(
    "/",
    protect,
    upload.single("image"),
    uploadPhoto
);

router.put(
    "/:photoId",
    protect,
    upload.single("image"),
    updatePhoto
);

router.delete(
    "/:photoId",
    protect,
    deletePhoto
);


module.exports = router;