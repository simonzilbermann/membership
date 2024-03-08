const mongoose= require('mongoose'); 
const redirects = require('../models/redirects');
const products = require('../models/products');
const categories = require('../models/category');


module.exports= {
    get_redirects:async(req,res)=>{
        const redirects_data = await redirects.find({});
       
        return res.status(200).json({redirects_data});
    },


    update_redirects: async (req, res) => {
      try {
        await redirects.deleteMany({});
    
        const Redirects = req.body.redirects;
        console.log(Redirects);
    
        await Promise.all(
          Redirects.map(async redirect => {
            const { Request_path, Target_path } = redirect;
    
            try {
              const newRedirect = new redirects({
                _id: new mongoose.Types.ObjectId(),
                Request_path,
                Target_path
              });
    
              await newRedirect.save();
            } catch (error) {
              console.error('Error saving redirect:', error);
              throw error;
            }
          })
        );
    
        return res.status(200).json({ message: 'Redirects updated successfully' });
      } catch (error) {
        console.error('Error updating redirects:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
    special_method: async (req, res) => {

      try {
        const all_products = await products.find({});
        const all_categories = await categories.find({});
        await Promise.all(
          all_products.map(async (prod) => {
            let Request_path = `/${prod.Sku}`;
            let Target_path = `/product/prodpage?sku=${prod.Sku}`;
            
            // Check if the redirect already exists
            const existingRedirect = await redirects.findOne({ Request_path });
            if (existingRedirect) {
              console.log(`Redirect already exists for Request_path: ${Request_path}`);
              return;
            }
            
            const newRedirect = new redirects({
              _id: new mongoose.Types.ObjectId(),
              Request_path,
              Target_path,
            });
            await newRedirect.save();
          }),
          all_categories.map(async(category)=>{
            let catid = category.cid;
            let catname = category.name;
            const existingRedirect = await redirects.findOne({ Request_path:"/"+catname });
            if (existingRedirect) {
              console.log(`Redirect already exists for Request_path: ${Request_path}`);
              return;
            }
            const newRedirect = new redirects({
              _id: new mongoose.Types.ObjectId(),
              Request_path: "/" + encodeURIComponent(catname.replace(/\s/g, "%20")),
              Target_path: `prodbycat?cid=${catid}&name=${encodeURIComponent(catname)}`,
            });
            await newRedirect.save();

          })
          

        );
        return res.status(200).json({ message: 'ריידרקטים מוצרים וקטגוריות עודכנו בהצלחה' });
      } catch (error) {
        console.error('Error executing special method:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    },
    
    

    

};
