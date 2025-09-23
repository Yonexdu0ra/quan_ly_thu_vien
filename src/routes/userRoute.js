const { Router }= require("express");
const router = Router();
const UserController = require("../controllers/UserController");


router.get("/", UserController.index);
router.get("/edit/:id", UserController.edit);
router.post("/edit/:id", UserController.updatePost);
router.get("/:id", UserController.detail);

module.exports = router;