const router=require('express').Router();
const {update_has_delevired,update_has_payment,get_order_by_id,delete_all,add_order,get_all_orders,update_order_status,close_order,cancel_order}=require('../controller/order');
router.post('/add',add_order);
router.get('/get_all',get_all_orders);
router.get('/delete_all',delete_all);
router.post('/get_order_by_id',get_order_by_id);
router.post('/close',close_order);
router.post('/update_status',update_order_status);
router.post('/update_delivred',update_has_delevired);
router.post('/update_paymnet',update_has_payment);
module.exports = router;