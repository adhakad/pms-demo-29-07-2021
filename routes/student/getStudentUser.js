var express = require('express');
var router = express.Router();
var studentUserModule=require('../../modules/studentUser');
var classModule=require('../../modules/class');

router.get('/', function(req, res) {
  var email=req.session.stu_email;
  var check=studentUserModule.findOne({email:email});
  check.exec((err, data)=>{
    res.render('./student/studentUserLogin', { title: 'Password Management System',data:data}); 
  });
});

router.post('/post',function(req, res, next) {
  var school_key = req.session.school_session_key;
  var email=req.session.stu_email;
  var class_name = req.session.class_name;
  var pin = req.body.pin;
  var checkUser=studentUserModule.findOne({email:email,class_name:class_name,school_key});
  checkUser.exec((err, data)=>{
    if(err) throw err;
    var pins = data.pin;
    var school_key = data.school_key;
    var getClass=classModule.findOne({class_name:class_name,school_key:school_key});
    getClass.exec(function(err,data){
        if(pin==pins){
          res.send({redirect:'./student-dashboard'});
        }else if(pin==121212){
          res.send({redirectTo: 'Invalid Pin.'});
        }else{
          res.send({redirectTo: 'Invalid Pin.'});
        }
    });
  });
});

router.put('/set-pin',function(req, res, next) {
  var email = req.session.stu_email;
  var pin=req.body.pin;
  var check=studentUserModule.findOne({email:email});
  check.exec((err,data)=>{
    if(err) throw err;
    if(data){
      var obj_id = data._id;
      var Update=studentUserModule.findByIdAndUpdate(obj_id,{pin:pin});
      Update.exec((err,data)=>{
        if(err) throw err;
        res.send({redirect:'/getStudentUser'});
      });
    }
  })
});

module.exports = router;