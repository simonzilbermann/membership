const router=require('express').Router();
const {get_orders_reports}=require('../controller/reports');
router.get('/get',get_orders_reports);
module.exports = router;