const { Router} = require("express");
const AuthController = require("../controllers/AuthController");


const router = Router();
router.get("/login", AuthController.viewLogin);
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);
router.get("/change-password", AuthController.viewChangePassword);
router.post("/change-password", AuthController.changePassword);
module.exports = router;
