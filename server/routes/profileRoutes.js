const express = require("express");
const router = express.Router();

const upload = require("../utils/upload");
const {auth} = require("../middlewares/authMiddleware");
const { getAllUsers, updateProfile, getOwnProfile, deleteUser } = require("../controllers/profileController");

router.get("/", getAllUsers);
router.put("/:id", upload.single("profileImage"), updateProfile);
router.get("/me", auth, getOwnProfile);
router.delete("/:id", deleteUser);

module.exports = router;
