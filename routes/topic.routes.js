const router = require('express').Router();
const ctrl = require('../controllers/topic.controller');

router.get("/list", ctrl.list)
router.get("/list/:t_id", ctrl.edit)
router.put("/list/:t_id", ctrl.update)
router.delete("/list/:t_id", ctrl.delete)
router.post("/list", ctrl.create)

router.get("/list/:t_id/indicator", ctrl.listInd)
router.get("/list/:t_id/indicator/:ind_id", ctrl.editInd)
router.put("/list/:t_id/indicator/:ind_id", ctrl.updateInd)
router.delete("/list/:t_id/indicator/:ind_id", ctrl.deleteInd)
router.post("/list/:t_id/indicator", ctrl.createInd)

module.exports = router;