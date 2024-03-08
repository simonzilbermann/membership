const router=require('express').Router();
const {AddContent,UpdateContent,DeleteContent,GetAllContent}=require('../controller/content_us');


router.post("/add",AddContent);
router.post("/delete",DeleteContent);
router.get("/get",GetAllContent);
router.post("/update",UpdateContent);


module.exports = router;
