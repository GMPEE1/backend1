const router = require('express').Router();
const ctrl = require('../controllers/allusers.controller');

router.get("/list/:u_role", ctrl.list)
router.get("/list/:u_role/:u_id", ctrl.edit)
router.put("/list/:u_role/:u_id", ctrl.update)
router.delete("/list/:u_role/:u_id", ctrl.delete)
router.post("/list", ctrl.create)

router.put("/updatePw/:u_id", ctrl.updatePw)
router.put("/resetPw/:u_id", ctrl.resetPw)

module.exports = router;