const mongoose = require('mongoose');
const whiteList = require('../models/white_list');

module.exports = {
  get_whiteList_Ip: (req, res) => {
    whiteList.find()
      .exec()
      .then((whitelist) => {
    
        res.status(200).json(whitelist);
      })
      .catch((error) => {
        console.error('Failed to read IP whitelist:', error);
        res.status(500).send('Failed to read IP whitelist');
      });
  },

  update_whitelist: (req, res) => {
    const whitelistArray = req.body.whitelist;
  
    const whitelistPromises = whitelistArray.map((whitelist) => {
      const { ipAddress, name } = whitelist;
  
      // Check if whitelist with the same IP address already exists
      return whiteList.findOne({ ipAddress: ipAddress })
        .exec()
        .then((existingWhitelist) => {
          if (existingWhitelist) {
            // Update the existing whitelist with the new name
            existingWhitelist.name = name;
            return existingWhitelist.save();
          } else {
            // Create a new whitelist entry
            const newWhiteList = new whiteList({
              _id: new mongoose.Types.ObjectId(),
              ipAddress: ipAddress,
              name: name
            });
            return newWhiteList.save();
          }
        });
    });
  
    Promise.all(whitelistPromises)
      .then((savedWhitelists) => {
        console.log('IPs added/updated in whitelist:', savedWhitelists);
        res.status(200).json(savedWhitelists);
      })
      .catch((error) => {
        console.error('Failed to update IP whitelist:', error);
        res.status(500).send('Failed to update IP whitelist');
      });
  },
  
  

  delete_ip_whiteLis: (req, res) => {
    
    const ipAddress = req.body.ipAddress;

    whiteList.deleteOne({ ipAddress: ipAddress })
      .exec()
      .then(() => {
        console.log('IP removed from whitelist:', ipAddress);
        res.status(200).send('IP removed from whitelist');
      })
      .catch((error) => {
        console.error('Failed to delete IP from whitelist:', error);
        res.status(500).send('Failed to delete IP from whitelist');
      });
  }
};
