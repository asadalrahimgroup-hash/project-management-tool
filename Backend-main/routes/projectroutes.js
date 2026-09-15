const express = require("express");

const router = express.Router();

const {
    authenticate,
    requireRole
} = require("../middleware/authMiddleware");

const {
    getProjects,
    getProjectById,
    getProjectManagers,
    createProject,
    updateProject,
    updateProjectDeadline,
    deleteProject,
    assignProject,
    unassignProject,
    updateProjectStatus,
    getProjectMembers,
    addProjectMember,
    removeProjectMember
} = require("../controllers/projectcontroller");


/*
============================================================
GET PROJECTS
============================================================
*/

router.get(
    "/",
    authenticate,
    getProjects
);


/*
============================================================
GET PROJECT MANAGERS
============================================================
*/

router.get(
    "/managers",
    authenticate,
    getProjectManagers
);


/*
============================================================
GET SINGLE PROJECT BY ID
============================================================
*/

router.get(
    "/:projectId",
    authenticate,
    getProjectById
);



router.post(
    "/",
    authenticate,
    requireRole("Executive Manager", "Project Manager", "System Administrator"),
    createProject
);


/*
============================================================
UPDATE PROJECT
============================================================
*/

router.patch(
    "/:projectId",
    authenticate,
    requireRole("Executive Manager", "Project Manager", "System Administrator"),
    updateProject
);


/*
============================================================
UPDATE PROJECT DEADLINE
============================================================
*/

router.patch(
    "/:projectId/deadline",
    authenticate,
    requireRole("Executive Manager", "Project Manager", "System Administrator"),
    updateProjectDeadline
);


/*
============================================================
DELETE PROJECT
============================================================
*/

router.delete(
    "/:projectId",
    authenticate,
    requireRole("Executive Manager", "Project Manager", "System Administrator"),
    deleteProject
);


/*
============================================================
ASSIGN PROJECT
============================================================
*/

router.patch(
    "/:projectId/assign",
    authenticate,
    requireRole("Executive Manager", "Project Manager", "System Administrator"),
    assignProject
);


/*
============================================================
UNASSIGN PROJECT
============================================================
*/

router.patch(
    "/:projectId/unassign",
    authenticate,
    requireRole("Executive Manager", "Project Manager", "System Administrator"),
    unassignProject
);

router.patch(
    "/:projectId/status",
    authenticate,
    requireRole("Executive Manager", "Project Manager", "System Administrator"),
    updateProjectStatus
);

/*
============================================================
PROJECT MEMBERS
============================================================
*/

router.get(
    "/:projectId/members",
    authenticate,
    getProjectMembers
);

router.post(
    "/:projectId/members",
    authenticate,
    requireRole("Executive Manager", "Project Manager", "System Administrator"),
    addProjectMember
);

router.delete(
    "/:projectId/members/:userId",
    authenticate,
    requireRole("Executive Manager", "Project Manager", "System Administrator"),
    removeProjectMember
);

module.exports = router;
