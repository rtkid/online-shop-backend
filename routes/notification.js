const router = require("express").Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

router.post("/add", checkRole("ADMIN"), notificationController.add);
router.get("/", authMiddleware, notificationController.getAll);
router.delete("/:_id", checkRole("ADMIN"), notificationController.deleteOne);
router.delete("/", checkRole("ADMIN"), notificationController.deleteAll);

module.exports = router;
