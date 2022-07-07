const router = require("express").Router();
const plantController = require("../controllers/plantController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

router.post("/add", checkRole("ADMIN"), plantController.add);
router.get("/:_id", plantController.getOne);
router.get("/", plantController.getAll);
router.delete("/:_id", checkRole("ADMIN"), plantController.deleteOne);
router.delete("/", checkRole("ADMIN"), plantController.deleteAll);
router.put("/update", checkRole("ADMIN"), plantController.updateOne);
router.patch("/rate/:_id", authMiddleware, plantController.rateOne);
router.patch("/buy/:_id", authMiddleware, plantController.buyOne)

module.exports = router;
