const express = require('express');

const bodyParser = require('body-parser');

const multer = require('multer');

const app = express();

const path = require('path');

const mongodb = require('mongodb');

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



app.listen(5000, () =>{

    console.log("seerver is listening on port 5000")
})