const router=require('express').Router();
const {get_coupon_by_id,get_all_coupons,generate_coupon,create_coupon,delete_many_coupons,delete_all_coupons,update_coupon}=require('../controller/coupons');

router.post("/generate_coupon",generate_coupon);
router.get("/get_all_coupons",get_all_coupons);
router.get("/delete_all_coupons",delete_all_coupons);
router.post("/get_coupon",get_coupon_by_id);
router.post("/create_coupon",create_coupon);
router.post("/delete_many_coupons",delete_many_coupons);
router.post("/update_coupon",update_coupon);

module.exports = router;