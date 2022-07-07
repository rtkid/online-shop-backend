const router = require("express").Router();
const userRoute = require("./user");
const plantRoute = require("./plant");
const notificationRoute = require("./notification");
const transactionRoute = require("./transaction");

router.use("/user", userRoute);
router.use("/plant", plantRoute);
router.use("/notification", notificationRoute);
router.use("/transaction", transactionRoute);

module.exports = router;
