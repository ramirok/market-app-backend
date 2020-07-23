const router = require("express").Router();

const { admin } = require("../controllers/admin.controller");

router.post("/admin", admin);

module.exports = router;
