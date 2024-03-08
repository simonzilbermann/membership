const router=require('express').Router();
const {get_whiteList_Ip,update_whitelist,delete_ip_whiteLis}=require('../controller/white_list');
router.get('/get',get_whiteList_Ip);
router.post('/update',update_whitelist);
router.post('/delete',delete_ip_whiteLis);
module.exports = router;