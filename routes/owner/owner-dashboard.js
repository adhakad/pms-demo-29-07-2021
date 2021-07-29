var express = require('express');
var router = express.Router();

var adminUserModule=require('../../modules/adminUser');

const { check, validationResult } = require('express-validator');

router.get('/',function(req, res, next) {
    var admin=adminUserModule.find({});
    admin.exec((err,data)=>{
      var key = "key$2a$10$787pS7KmgBDMUDzANMdBh.k2creKQ6BJHn/M7Uf61W";
      res.render('./owner/owner-dashboard',{ title: 'Owner Dashboard',msg:'', data:data,key:key});
    }); 
});


router.delete('/delete', function(req, res,) {
  var id=req.body.id;
  var admin=adminUserModule.findOne({_id:id});
  admin.exec(function(err,data){
    if(err) throw err;
    var ObjectiId=data._id;
    var adminKey=adminUserModule.findByIdAndDelete(ObjectiId);
    adminKey.exec(function(err){
      if(err) throw err;
      res.send({msg:'success'}); 
    });  
  });
});

router.put('/enable', function(req, res,) {
  var id=req.body.id;
  var admin=adminUserModule.findOne({_id:id});
  admin.exec(function(err,data){
    if(err) throw err;
    var ObjectiId=data._id;
    var adminKey=adminUserModule.findByIdAndUpdate(ObjectiId,{key:'34rfde544wt5a3ew3234243rw4d5545w44d4c3d33dtr'});
    adminKey.exec(function(err){
      if(err) throw err;
      res.send({msg:'success'}); 
    });  
  });
});

module.exports = router;
