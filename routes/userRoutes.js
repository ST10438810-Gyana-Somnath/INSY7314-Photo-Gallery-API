const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    getProfile,
    updateProfile,
    getAllUsers,
    deleteUser,
    promoteUser,
    demoteUser
} = require("../controllers/userController");

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

router.get("/", protect, adminOnly, getAllUsers);
router.delete("/:userId", protect, adminOnly, deleteUser);
router.put("/:userId/promote", protect, adminOnly, promoteUser);
router.put("/:userId/demote", protect, adminOnly, demoteUser);

module.exports = router;