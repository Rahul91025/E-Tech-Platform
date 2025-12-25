// Ye admin.routes routes hai jo admin.routes related routes define karta hai.
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const controller = require("../controllers/admin.controller");

router.get("/dashboard", auth, role("ADMIN"), controller.getDashboard);
router.get("/users", auth, role("ADMIN"), controller.getUsers);
router.put("/approve-teacher/:id", auth, role("ADMIN"), controller.approveTeacher);
router.get("/test-series", auth, role("ADMIN"), controller.getTestSeries);
router.put("/approve-test/:id", auth, role("ADMIN"), controller.approveTestSeries);
router.get("/analytics", auth, role("ADMIN"), controller.getAnalytics);
router.get("/revenue", auth, role("ADMIN"), controller.getRevenue);

module.exports = router;

