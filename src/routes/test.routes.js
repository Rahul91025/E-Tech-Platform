// Ye test.routes routes hai jo test.routes related routes define karta hai.
const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { testSeriesSchema, questionSchema } = require("../utils/validationSchemas");
const controller = require("../controllers/test.controller");

router.get("/", auth, controller.getTests);
router.post("/", auth, role(["TEACHER"]), validate(testSeriesSchema), controller.createTestSeries);
router.get("/:id", auth, controller.getTestSeries);
router.put("/:id", auth, role(["TEACHER"]), validate(testSeriesSchema), controller.updateTestSeries);
router.delete("/:id", auth, role(["TEACHER"]), controller.deleteTestSeries);
router.put("/:id/approve", auth, role(["ADMIN"]), controller.approveTestSeries);
router.get("/:id/questions", auth, role(["TEACHER", "ADMIN"]), controller.getQuestions);

module.exports = router;

