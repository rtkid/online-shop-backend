const router = require("express").Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

router.post("/register", authMiddleware, transactionController.register);
router.get("/", checkRole("ADMIN"), transactionController.getAll);
router.delete("/:_id", checkRole("ADMIN"), transactionController.deleteOne);

module.exports = router;
