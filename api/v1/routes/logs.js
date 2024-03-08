const router=require('express').Router();
const {add_log,get_all_logs,remove_all_logs,get_log_by_id,get_log_by_type}=require('../controller/logs');
router.post("/add",add_log);
router.post("/get_log_by_id",get_log_by_id);
router.post("/get_log_by_type",get_log_by_type);
router.get('/get_all_logs',get_all_logs);
router.get('/clear_all',remove_all_logs);
module.exports = router;