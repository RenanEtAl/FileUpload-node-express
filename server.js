const express = require('express');

const bodyParser = require('body-parser');

const multer = require('multer');

const app = express();

const path = require('path');

const mongodb = require('mongodb');

const fs = require('fs');

// use the middleware of bodyparser

app.use(bodyParser.urlencoded({extended:true}))

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads');
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }

})


var upload = multer({
    storage:storage
})

// configuring mongodb
// mongodb://localhost:27017
const MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://ren:cLkcMkK1lWRw6szF@cluster0-eaovm.mongodb.net/test?retryWrites=true&w=majority';

MongoClient.connect(url, {
    useUnifiedTopology: true, useNewUrlParser:true
},(err,client) => {
    if(err) return console.log(err);

    db = client.db('Images');

    app.listen(3000, ()=> {
        console.log(" mongodb server listening at 3000")
    })
})

// configuring the home route
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
})

// configuring the upload file route

app.post('/uploadfile', upload.single('myFile'), (req,res,next) => {
    const file = req.file;

    if(!file){
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file);

})

// configure the multiple files route
app.post("/uploadmultiple", upload.array('myFiles', 5), (req,res,next) => {
    const files = req.files;

    if(!files){
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);

    }

    res.send(files);
})

// configure the image upload to the database
app.post("/uploadphoto", upload.single('myImage'), (req,res)=>{
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');

    // define a JSON object for the image
    var finalImg = {
        contentType:req.file.mimetype,
        path:req.file.path,
        image:new Buffer(encode_image, 'base64')
    };

    // insert the image to the database
    db.collection('image').insertOne(finalImg, (err,result)=>{
        console.log(result);

        if(err) return console.log(err);

        console.log("Saved to database");

        res.contentType(finalImg.contentType);
        res.send(finalImg.image);
    })
})

app.listen(5000, () =>{

    console.log("seerver is listening on port 5000")
})