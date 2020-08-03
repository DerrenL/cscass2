const express = require( 'express' );
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );
const { resolve } = require('path');
const { CodeBuild } = require('aws-sdk');
const mysql = require('mysql');

//sql database store image url and details
const con = mysql.createConnection({
  host: "csc-assignment-2.cmme4aakl6nd.ap-southeast-1.rds.amazonaws.com", //Endpoint
  user: "admin",
  password: "secure_password",
});

const router = express.Router();


const BitlyClient = require('bitly').BitlyClient;
const bitly = new BitlyClient('64948d9a94ed29df9ce4abe09ca4435b777f3171');


/**
 * PROFILE IMAGE STORING STARTS
 */
const s3 = new aws.S3({
    accessKeyId: 'AKIAQHTZOSPSRJJSV235',
    secretAccessKey: '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',
    Bucket: 'assignment2csc'
   });

   /**
 * Single Upload
 */
const profileImgUpload = multer({
    storage: multerS3({
     s3: s3,
     bucket: 'assignment2csc',
     acl: 'public-read',
     key: function (req, file, cb) {
      cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) );
    }
    }),
    limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function( req, file, cb ){
     checkFileType( file, cb );
    }
   }).single('profileImage');

//    /**
//  * Check File Type
//  * @param file
//  * @param cb
//  * @return {*}
//  */


function checkFileType( file, cb ){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );if( mimetype && extname ){
     return cb( null, true );
    } else {
     cb( 'Error: Images Only!' );
    }
   }

   //Bitly shorten url function
    async function init(url){
    let result;
    try {
      result = await bitly.shorten(url);
      console.log('Bitly init: ' + result.link);
      return result.link;
    } catch (e) {
      throw e;
    }
  }
  

//    /**
//  * @route POST api/profile/business-img-upload
//  * @desc Upload post image
//  * @access public
//  */
let shorturl;
router.post( '/profile-img-upload', ( req, res ) => {
    profileImgUpload( req, res, ( error ) => {
    // console.log( 'requestOkokok', req.file );
    // console.log( 'error', error );
    if( error ){
     console.log( 'errors', error );
     res.json( { error: error } );
    } else if(req.file === undefined) {
     // If File not found
      console.log( 'Error: No File Selected!' );
      res.json( 'Error: No File Selected' );
    } else {
      // If Success
      const test = JSON.parse(req.body.data2);
      console.log(test.name);
      const imageName = req.file.key;
      let imageLocation = req.file.location;// Save the file name into database into profile model
      con.query("CREATE DATABASE IF NOT EXISTS main;");
        con.query("USE main;");
        con.query(
          "CREATE TABLE IF NOT EXISTS test(id int NOT NULL AUTO_INCREMENT, url varchar(100), talentName varchar(100), talentAge int, talentOccupation varchar(100), talentDescription varchar(300), PRIMARY KEY(id));",
          function (error, result, fields) {
            console.log(result);
          }
        );
    
        con.query(
          `INSERT INTO main.test (url,talentName,talentAge,talentOccupation,talentDescription) VALUES ('${imageLocation}','${test.name}', '${test.age}','${test.occupation}', '${test.description}')`,
          function (err, result, fields) {
            if (err) res.send(err);
            if (result) {
              res.send(imageLocation);
            }
            if (fields) console.log(fields);
          }
        );
      (async () => {
        console.log('Initializing async to get data from init function');
         shorturl = await init(imageLocation); 
        res.json({
          image: imageName,
          location: shorturl
       });
      })()
     }
   });
  });


  router.get( '/talent-details', ( req, res ) => {
    con.query("select * from main.test", function (err, result, fields) {
      if (err) throw err;
      if(result){
        res.send(result);
      }
      console.log(result);
  });
})

router.get( '/onetalent-details/:talentID', ( req, res ) => {
  var id = req.params.talentID;
  con.query("select * from main.test where id =?",id , function (err, result, fields) {
    if (err) throw err;
    if(result){
      res.send(result);
    }
    console.log(result);
});
})

router.delete( '/delete-talent/:talentID', ( req, res ) => {
  var id = req.params.talentID;
  con.query("delete from main.test where id = ?",id ,function (err, result, fields) {
    if (err) throw err;
    if(result){
      res.send(result);
    }
    console.log(result);
});
})

router.put( '/edit-talent/:talentID', ( req, res ) => {
  var id = req.params.talentID;
  let data = [req.body.url,req.body.name,req.body.age,req.body.occupation,req.body.description, id];
  con.query("update main.test set url= ? , talentName = ?, talentAge = ? ,talentOccupation=?,talentDescription=?  where id = ?",data ,function (err, result, fields) {
    if (err) throw err;
    if(result){
      res.send(result);
    }
    console.log(result);
});
})

  module.exports = router;
