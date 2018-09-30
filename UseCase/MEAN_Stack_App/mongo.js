/**
 * Created by karthik on 7/14/17.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var cors = require('cors');
var app = express();

var url='mongodb://himabindu:chinnupandu811@ds119323.mlab.com:19323/webicp';//1.Modify this url with the credentials of your db name and password.

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/create', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        insertDocument(db, req.body, function() {
            res.write("Successfully inserted");
            res.end();
        });
    });
});

app.get('/get', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }

        db.collection('books').find().toArray(function(err, result){
            if(err)
            {
                res.write("get Failed");
                res.end();
            }else
            {

                res.send(JSON.stringify(result));
            }
            console.log("Got All Documents");

        });
    });

});

app.get('/delete/:toBeDeleted_id', function (req, res) {

    MongoClient.connect(url, function(err, db) { //connecting to the server
        if(err) //if error occurs then error message is displayed
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }

        db.collection('books').deleteOne({ _id: ObjectID( req.params.toBeDeleted_id)},function(err, result){ //deleteOne function is used to perform delete function
            if(err) //if error occurs after delete operation then error message is showed
            {
                res.write("get Failed");
                res.end();
            }else
            {

                res.send(JSON.stringify(result));
            }
            console.log("Got All Documents"); //output is obtained

        });
    });

});


app.get('/update/:toBeUpdated_id', function (req, res) {
    MongoClient.connect(url, function(err, db) { //connecting to server
        if(err) //if error occurs then error message is displayed
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        console.log(req.query);
        db.collection('books').updateOne({ _id: ObjectID( req.params.toBeUpdated_id)},{$set:{bookName : req.query.bookName, authorName : req.query.authorName, ISBN : req.query.ISBN}},function(err, result){ //update option is used
            if(err)
            {
                res.write("get Failed");
                res.end();
            }else
            {

                res.send(JSON.stringify(result));
            }
            console.log("Got All Documents"); // output is obtained

        });
    });

    //3.connect to MongoDB. Handle the error and write the logic for updating the selected field
});


var insertDocument = function(db, data, callback) {
    db.collection('books').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the books collection.");
        callback();
    });
};

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});