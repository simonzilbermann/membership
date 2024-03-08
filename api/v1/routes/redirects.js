const router=require('express').Router();
const {update_redirects,get_redirects,special_method}=require('../controller/redirects');
router.post('/update',update_redirects);
router.get('/set_redirects',special_method);
router.get('/get',get_redirects);
module.exports = router;