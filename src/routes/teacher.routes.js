// Ye teacher.routes routes hai jo teacher.routes related routes define karta hai.
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { approvedTeacher } = require("../middlewares/approval.middleware");
const validate = require("../middlewares/validate.middleware");
const controller = require("../controllers/teacher.controller");

router.post("/questions/:testId", auth, role("TEACHER"), approvedTeacher, controller.addQuestion);
router.put("/tests/:id", auth, role("TEACHER"), approvedTeacher, controller.updateTest);
router.get("/analytics", auth, role("TEACHER"), approvedTeacher, controller.getAnalytics);

module.exports = router;

