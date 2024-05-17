/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const libraryModel = require('../models/library');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const foundBook = await libraryModel.find({});
      res.json(foundBook);
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) return res.send('missing required field title');
      
      // Title: 'name of book'
      const bookData = { 
        'title': title,
      };

      const newBook = new libraryModel(bookData);;
      const savedBook = await newBook.save();
      return res.json({ _id: savedBook._id, title: savedBook.title });
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      const deletedLibrary = await libraryModel.deleteMany({});
      deletedLibrary ? res.send('complete delete successful') : res.send('no library');
    });

  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const foundBook = await libraryModel.findById(bookid);
        if (!foundBook) return res.send('no book exists');
        const comments = foundBook.comments || [];
        return res.json({ "title": foundBook.title, "comments": comments, "_id": foundBook._id});
      } catch (err) {
        return res.send('no book exists');
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      try {
        const foundBook = await libraryModel.findById(bookid);
        if (!foundBook) return res.send('no book exists');
        if (!comment) return res.send('missing required field comment');

        foundBook.comments.push(comment);
        ++foundBook.commentcount;
        await foundBook.save();

        return res.json({ "title": foundBook.title, "comments": foundBook.comments, "_id": foundBook._id});
      } catch(error) {
        return res.send('no book exists');
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      try {
        //if successful response will be 'delete successful'
        const foundBook = await libraryModel.findByIdAndDelete(bookid);
        if (!foundBook) return res.send('no book exists');
        return res.send('delete successful');
      } catch (err) {
        return res.send('no book exists');
      }
    });
  
};
