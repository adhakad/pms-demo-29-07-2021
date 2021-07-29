var express = require('express');
var router = express.Router();

var teacherModal=require('../../modules/teacher');
var classTeacherModal=require('../../modules/classTeacher');

var bodyParser = require('body-parser');
var path = require('path');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
const { check, validationResult } = require('express-validator');
router.use(express.static(__dirname+"./public/"));
 


router.get('/', function(req, res,) {
  var school_key = req.session.school_session_key;
  var teacher=teacherModal.find({class_teacher_status:'active',school_key:school_key});
  teacher.exec((err,data)=>{
    if(err) throw err;
    res.render('./teacher/classTeacher', { title: 'Class Teacher Details',records:data});
  });
});


router.get('/addClassTeacher/:id', function(req, res,) {
  var teacher_uid=req.params.id;
  teacher=teacherModal.findOne({teacher_uid:teacher_uid});
  teacher.exec((err,data)=>{
    if(err) throw err;
      res.render('./teacher/addClassTeacher', { title: 'TechBista Solutions',msg:'', records:data});

  });      


router.post('/addClassTeacher',function(req, res,) {
    var teachername=req.body.tname; 
    var teacher_uid = req.body.teacher_uid;
    var class_name=req.body.class_name;
    var class_teacher_status=req.body.class_teacher_status;
    teacher=teacherModal.findOne({teacher_uid:teacher_uid});
    teacher.exec((err,data)=>{
    if(err) throw err;

    classTeacher=classTeacherModal.findOne({class_name:class_name});
    classTeacher.exec((err,result)=>{
    if(err) throw err;
    if(result==null){

  var userDetails=new classTeacherModal({
    teachername:teachername,
    teacher_uid:teacher_uid,
    class_name:class_name,
    class_teacher_status:class_teacher_status,
  });
  userDetails.save((err,doc)=>{
    if(err) throw err;
    res.render('./teacher/addClassTeacher', { title: 'TechBista Solutions',msg:'Class Teacher Create Successfully!', records:data});
    });
  }else{
    res.render('./teacher/addClassTeacher', { title: 'TechBista Solutions',msg:'Class Already Created', records:data});
  }
    });
    });
  });

});

module.exports = router;