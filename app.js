const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("'mongodb://localhost:27017/WikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const wikischema = new mongoose.Schema({
    title: String,
    content: String
});

const Wiki = mongoose.model('article', wikischema);

app.route("/")
    .get(function (req, res) {
        res.render('home');
    });

app.route("/articles")
    .get(function (req, res) {
        Wiki.find({}, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                res.send(results);
            }
        });
    })
    .post(function (req, res) {
        console.log(req.body.title);
        console.log(req.body.content);
        const articlenew = new Wiki({
            title: req.body.title,
            content: req.body.content
        });
        articlenew.save(function (err) {
            if (err) {
                res.send(err);
            }
            else {
                res.send("success");
            }
        });
    })
    .delete(function (req, res) {
        Wiki.deleteMany({}, function (err) {
            if (err) {
                res.send(err);
            }
            else {
                res.send("Succesfully deleted");
            }
        });
    });

app.route("/articles/:id")
    .get(function (req, res) {
        Wiki.findOne({ title: req.params.id }, function (err, results) {
            if (err) { console.log(err) }
            else {
                res.send(results);
            }
        })
    })
    .post(function (req, res) {
        
    })
    .put(function(req, res){
        Wiki.updateOne(
            { title: req.params.id }
            , { title: req.body.title, content: req.body.content }
            , { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("successfully updated the document");
                }
            });
    })
    .delete(function (req, res) {
        Wiki.deleteOne({title:req.params.id},
            function(err){
                if(!err){
                    res.send("Successfully deleted!!!");
                }
            });
        
    })
    .patch(function(req,res){
        Wiki.updateOne({title:req.params.id},
            {$set:req.body},
            function(err){
                if(!err){
                    res.send("Successfully updated!!!");
                }
            });
    });


app.listen(3000, function (req, res) {
    console.log("Server 3000 is up and running!!!");
});