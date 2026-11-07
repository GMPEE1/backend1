const router = require('express').Router();
const ctrl = require('../controllers/evaluation.controller');

router.get("/list/:u_id", ctrl.list)
router.post("/create", ctrl.create)

module.exports = router;