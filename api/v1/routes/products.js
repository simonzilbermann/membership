const router=require('express').Router();
const {delete_all_prods,search_prods,delete_image_prod,DeleteProdParams,DelteAll,GetAllNames,GetCsvProds,GetAll,UpdateProdPic,GetProdById,AddProd,DeleteProd,UpdateProd,GetAll2,GetAll3}=require('../controller/products');
router.get("/all3/:cid",GetAll3);
router.get("/delparam/:Sku",DeleteProdParams);
router.get("/all",GetAll);
router.get("/names",GetAllNames);
router.get("/all2",GetAll2);
router.get("/deleteall",DelteAll);
router.post("/csvprods",GetCsvProds);
router.post("/getbyid",GetProdById);
router.post("/add",AddProd);
router.post("/del",DeleteProd);
router.post("/update",UpdateProd);
router.post("/updateimage",UpdateProdPic);
router.post('/delete_image_prod',delete_image_prod);
router.post('/search',search_prods);
router.get('/delete_all_prods',delete_all_prods);
module.exports = router;