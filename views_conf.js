const fs = require('fs');
module.exports ={
    get_view_hp:(req,res)=>{
        try {
            configData = JSON.parse(fs.readFileSync('public/configurationjson/view_hp_config.json'));
            
            return res.status(200).json(JSON.stringify( configData));
          } catch (err) {
            return res.status(408).json(err);
          }
    },
    get_view_prods:(req,res)=>{
        try {
            configData = JSON.parse(fs.readFileSync('public/configurationjson/view_prods.json'));
            
            return res.status(200).json(JSON.stringify( configData));
        } catch (err) {
            return res.status(408).json(err);
        }
    },
    save_view_prods:(req,res)=>{
        let configData = req.body;
        try {
            fs.writeFileSync('public/configurationjson/view_prods.json', JSON.stringify(configData ));
            console.log('Views saved to config file successfully');
        } catch (err) {
            console.error(err);
        }
    },
    save_view_hp:(req,res)=>{
        let configData = req.body;
        try {
          fs.writeFileSync('public/configurationjson/view_hp_config.json', JSON.stringify(configData ));
          console.log('Views saved to config file successfully');
        } catch (err) {
          console.error(err);
        }
    },
    get_banner_rashi:(req,res)=>{
        try {
            configData = JSON.parse(fs.readFileSync('public/configurationjson/homepage_banner.json'));
            console.log(configData.title);
            return res.status(200).json(JSON.stringify( configData));
        } catch (err) {
            return res.status(408).json(err);
        }
    },
    save_banner_rashi:(req,res)=>{
        const jsonData = JSON.parse(req.body.jsonData);
        

        try {
          fs.writeFileSync('public/configurationjson/homepage_banner.json', JSON.stringify(jsonData ));
          console.log('Views saved to config file successfully');
          res.sendStatus(200);
        } catch (err) {
          console.error(err);
          res.sendStatus(500);
        }
    },
    get_categories_banners:(req,res)=>{
        try {
             let configData = JSON.parse(fs.readFileSync('public/configurationjson/categories_banners.json'));
            
            return res.status(200).json(JSON.stringify( configData));
        } catch (err) {
            return res.status(408).json(err);
        }
    },
    save_categories_banners:(req,res)=>{
        let jsonData = JSON.parse(req.body.jsonData);
        try {
          fs.writeFileSync('public/configurationjson/categories_banners.json', JSON.stringify(jsonData ));
          console.log('Views saved to config file successfully');
          res.sendStatus(200);
          
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
          
        }
    },
  
    
    
      
      
      
      
};