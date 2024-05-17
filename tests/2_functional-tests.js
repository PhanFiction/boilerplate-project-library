/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const libraryModel = require('../models/library');

chai.use(chaiHttp);
const api = '/api/books';

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .post(api)
        .send({title: 'Indiana Jones and the Last Crusade'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'Books in array should contain title');
          assert.isObject(res.body, 'response should be an object');
          assert.equal(res.body.title, 'Indiana Jones and the Last Crusade', 'Title should be the same as the body');
          assert.property(res.body, '_id', 'Books in array should contain _id');
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .post(api)
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title');
          done();
        })
      });
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books', function(done){
        chai
        .request(server)
        .get(api)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'should be an array of objects');
          assert.isObject(res.body[0], 'Should be an object');
          assert.property(res.body[0], '_id', 'should contain _id');
          assert.property(res.body[0], 'title', 'should have title');
          assert.property(res.body[0], 'comments', 'should have empty comments');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .get(`${api}/82h312jk0sajd`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'no book exists')
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db', async function(){
        const foundBook = await libraryModel.find({});
        chai
        .request(server)
        .get(`${api}/${foundBook[0]._id}`)
        .end((err, res) => {
          assert.isObject(res.body, 'shoud be object');
          assert.property(res.body, 'comments', 'should contain comments');
          assert.property(res.body, '_id', 'should contain _id');
          assert.property(res.body, 'title', 'should contain title');
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', async function(){
        const foundBook = await libraryModel.find({});
        chai
        .request(server)
        .post(`${api}/${foundBook[0]._id}`)
        .send({ comment: 'cool book' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body.comments);
          assert.property(res.body, 'comments', 'should contain comments');
          assert.property(res.body, '_id', 'should contain _id');
          assert.property(res.body, 'title', 'should contain title');
        })
      });

      test('Test POST /api/books/[id] without comment field', async function(){
        const foundBook = await libraryModel.find({});
        chai
        .request(server)
        .post(`${api}/${foundBook[0]._id}`)
        .send({ comment: null })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
        .request(server)
        .post(`${api}/231231`)
        .send({comment: 'Reddit books'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', async function(){
        const foundBook = await libraryModel.find({});
        chai
        .request(server)
        .delete(`${api}/${foundBook[0]._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .delete(`${api}/231231`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        })
      });
    });
  });

});
