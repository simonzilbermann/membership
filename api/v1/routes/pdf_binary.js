const router=require('express').Router();
const {clear_collection,saving_pdfs,save_pdf_to_folder}=require('../controller/pdf_binary');

router.get('/saving_pdf_to_folder',save_pdf_to_folder);
router.get('/saving_pdf',saving_pdfs);
router.get('/clear_collection',clear_collection);
module.exports = router;