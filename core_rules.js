const fs = require('fs');

const globalpath ='./public/configurationjson/config.json';
module.exports ={
    update_rules:(req,res)=>{
        try {
            const ruleId = req.params.id;
            const updatedRule = req.body; // assuming the updated rule data is sent in the request body
            let configData = [];
            try {
              configData = JSON.parse(fs.readFileSync(globalpath));
            } catch (err) {
              console.error(err);
            }
            const updatedConfigData = configData.map(rule => {
              if (rule.ruleid === ruleId) {
                return { ...rule, ...updatedRule };
              } else {
                return rule;
              }
            });
            try {
              fs.writeFileSync('', JSON.stringify(updatedConfigData));
              console.log('Rule updated in config file successfully');
            } catch (err) {
              console.error(err);
            }
            return res.status(200);
          } catch (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
          }
    },
    delete_rule:(req,res)=>{
        try {
            const ruleId = req.params.id;
            let configData = [];
            try {
              configData = JSON.parse(fs.readFileSync(globalpath));
            } catch (err) {
              console.error(err);
            }
            const updatedConfigData = configData.filter(rule => rule.ruleid !== ruleId);
            try {
              fs.writeFileSync('', JSON.stringify(updatedConfigData));
              console.log('Rule deleted from config file successfully');
            } catch (err) {
              console.error(err);
            }
            return res.status(200);
          } catch (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
          }
    },
    get_all_rules:(req,res)=>{
        let configData = {};
        try {
            configData = JSON.parse(fs.readFileSync(globalpath));
        } catch (err) {
            console.error(err);
        }
        return res.status(200).json(configData);
    },
    save_rules:(req,res)=>{
        try {
            const rule = req.body;
            console.log(rule);
            let configData = [];
            try {
              configData = JSON.parse(fs.readFileSync(globalpath));
            } catch (err) {
              console.error(err);
            }
            configData.push(rule);
            try {
              fs.writeFileSync('', JSON.stringify(configData));
              console.log('Rule saved to config file successfully');
            } catch (err) {
              console.error(err);
            }
            return res.status(200);
          } catch (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }
    },

}