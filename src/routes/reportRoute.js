const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");


router.get("/dashboard", ReportController.index);

module.exports = router;
