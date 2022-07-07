const router = require("express").Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.get("/:_id", userController.getOne);
router.get("/", userController.getAll);
router.delete("/:_id", checkRole("ADMIN"), userController.deleteOne);
router.delete("/", checkRole("ADMIN"), userController.deleteAll);
router.put("/update", authMiddleware, userController.updateOne);
router.patch("/wishlist/add/:plantId", authMiddleware, userController.addPlant);
router.patch("/wishlist/remove/:plantId", authMiddleware, userController.removePlant);

module.exports = router;

/**
 * tags:
 *   name: User
 *   description: The users managing API
 */
