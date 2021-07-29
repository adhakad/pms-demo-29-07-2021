var express = require('express');
var router = express.Router();
var bcrypt =require('bcryptjs');

var adminUserModule=require('../../modules/adminUser');

router.get('/', function(req, res, next) {
  var email=req.session.auth_email;
  var checkUser=adminUserModule.findOne({email:email});
  checkUser.exec((err, data)=>{
    res.render('./admin/admin-panel', { title: 'Password Management System',data:data});
  });
});


function checkPin(req,res,next){
  var email=req.session.auth_email;
  var checkPin=adminUserModule.findOne({email:email});
  checkPin.exec((err,data)=>{
    if(err) throw err;
    var pin = data.pin;
    if(pin==121212){
      return res.send({redirectTo: 'Invalid Pin.'});
    }
   next();
  });
}
router.post('/post',checkPin,function(req, res, next) {
  var email=req.session.auth_email;
  var pin = req.body.pin;
  var checkUser=adminUserModule.findOne({email:email});
  checkUser.exec((err, data)=>{
    if(err) throw err;
    var pins = data.pin;
    if(pin==pins){
      res.send({redirect:'./admin-dashboard'});
    }else{
      res.send({redirectTo: 'Invalid Pinn.'});
    }
  });
});

router.put('/set-pin',function(req, res, next) {
  var email = req.session.auth_email;
  var pin=req.body.pin;
  var check=adminUserModule.findOne({email:email});
  check.exec((err,data)=>{
    if(err) throw err;
    if(data){
      var obj_id = data._id;
      var adminUserUpdate=adminUserModule.findByIdAndUpdate(obj_id,{pin:pin});
      adminUserUpdate.exec((err,data)=>{
          if(err) throw err;
          res.send({redirect:'/admin-panel'});
        });
    }
  })
});





router.get('/admin-register', function(req, res, next) {
  res.render('./admin/admin-register', { title: 'Password Management System', msg:'' });
});

function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexitemail=adminUserModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('./admin/admin-register', { title: 'Password Management System', msg:'Email Already Exist !' });
    }
   next();
  });
}

function checkConfPassword(req,res,next){
  var password=req.body.password;
  var confpassword=req.body.confpassword;
    if(password !=confpassword){
      return res.render('./admin/admin-register', { title: 'Password Management System', msg:'Password not matched!' });
    }
   next();
}
router.post('/admin-register',checkConfPassword,checkEmail,function(req, res, next) {
        var email=req.body.email;
        var admin_name=req.body.admin_name;
        var school_name=req.body.school_name;
        var student_count = req.body.student_count;
        var password=req.body.password;
        password =bcrypt.hashSync(req.body.password,10);
        var userDetails=new adminUserModule({
          email:email,
          admin_name:admin_name,
          school_name:school_name,
          student_count:student_count,
          password:password, 
        });
      userDetails.save((err,doc)=>{
        if(err) throw err;
        res.render('./admin/admin-register', { title: 'Password Management System', msg:'User Registerd Successfully' });
      });
});

module.exports = router;
