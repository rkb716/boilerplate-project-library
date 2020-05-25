/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function (app) {
  mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});
  const BookSchema = new Schema({title: String, comments: [String]});
  const BOOK = mongoose.model("BOOK", BookSchema);

  app.route('/api/books')
    .get(function (req, res){
      BOOK.find({}, function(err, data) {
        if(err) {
          console.log(err);
        } else {
          //response will be array of book objects
          //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
          let toReturn = [];
          for(let i = 0; i < data.length; i++) {
            toReturn.push({"_id": data[i]._id, "title": data[i].title, "commentcount": data[i].comments.length});
          }
          return res.json(toReturn);
        }
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      let newBook = new BOOK({title, comments: []});
      newBook.save(function(err) {
        if(err) {
          console.log(err);
        }
      });
      //response will contain new book object including atleast _id and title
      return res.json({"title": newBook.title, "comments": newBook.comments, "_id": newBook._id});
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      BOOK.deleteMany({}, function(err) {
        if(err) {
          console.log(err);
          res.send("error: " + err);
        } else {
          res.send("complete delete successful");
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      BOOK.findById(bookid, function(err, data) {
        if(err) {
          console.log(err);
        } else {
          //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
          return res.json({"_id": data._id, "title": data.title, "comments": data.comments});
        }
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      BOOK.findById(bookid, function(err, data) {
        if(err) {
          console.log(err);
        } else {
          data.comments.push(comment);
          data.save((err) => {
            if(err) {console.log(err)}
          });
          //json res format same as .get
          return res.json({"_id": data._id, "title": data.title, "comments": data.comments});
        }
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      BOOK.findByIdAndDelete(bookid, function(err) {
        if(err) {
          console.log(err);
          return res.send("error: could not delete");
        } else {
          return res.send("delete successful");
        }
      })
    });
  
};
