const express = require("express");

const router = express.Router();

const {
  getUsers,
  createUser,
  updateUserStatus,
  deleteUser,
} = require("../controllers/usercontroller");

// IMPORTANT: authenticate is a named export
const { authenticate } = require("../middleware/authMiddleware");

// adminMiddleware exports the function directly
const requireSystemAdministrator = require("../middleware/adminMiddleware");

/* =========================================================
   SYSTEM ADMINISTRATOR USER MANAGEMENT
========================================================= */

router.get(
  "/",
  authenticate,
  requireSystemAdministrator,
  getUsers
);

router.post(
  "/",
  authenticate,
  requireSystemAdministrator,
  createUser
);

router.patch(
  "/:id/status",
  authenticate,
  requireSystemAdministrator,
  updateUserStatus
);

router.delete(
  "/:id",
  authenticate,
  requireSystemAdministrator,
  deleteUser
);

module.exports = router;
