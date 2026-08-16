const User = require("../models/User");

// GET /api/users/me
const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error while retrieving profile.",
            error: error.message
        });
    }
};


// PUT /api/users/me
const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({
                email: email.toLowerCase()
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Email address is already in use."
                });
            }
        }

        if (username) {
            user.username = username;
        }

        if (email) {
            user.email = email.toLowerCase();
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error while updating profile.",
            error: error.message
        });
    }
};

// GET /api/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            message: "Server error while retrieving users.",
            error: error.message
        });
    }
};


// DELETE /api/users/:userId
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        await user.deleteOne();

        res.status(200).json({
            message: "User deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error while deleting user.",
            error: error.message
        });
    }
};


// PUT /api/users/:userId/promote
const promoteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (user.role === "admin") {
            return res.status(400).json({
                message: "User is already an administrator."
            });
        }

        user.role = "admin";

        await user.save();

        res.status(200).json({
            message: "User promoted to administrator successfully.",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error while promoting user.",
            error: error.message
        });
    }
};


// PUT /api/users/:userId/demote
const demoteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        if (user.role === "user") {
            return res.status(400).json({
                message: "User is already a normal user."
            });
        }

        user.role = "user";

        await user.save();

        res.status(200).json({
            message: "Administrator demoted to user successfully.",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error while demoting user.",
            error: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAllUsers,
    deleteUser,
    promoteUser,
    demoteUser
};