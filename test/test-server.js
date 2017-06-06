const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);


describe('Blog Posts', function() {
	before(function() {
    return runServer();
  });

	after(function() {
    return closeServer();
  });

  it('should list items on GET', function() {
  	return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.be.at.least(1);
      const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys);
      });
    });
  });

  it('should add a blog post on POST', function() {
    const newPost = {
      title: 'I finished server side development',
      content: 'I am ready to learn ReactJS',
      author: 'Jason Dax'
    };
    const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));

    return chai.request(app)
    .post('/blog-posts')
    .send(newPost)
    .then(function(res) {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.all.keys(expectedKeys);
      res.body.title.should.equal(newPost.title);
      res.body.content.should.equal(newPost.content);
      res.body.author.should.equal(newPost.author)
    });
  });

  it('should update blog posts on PUT', function() {
    return chai.request(app)
      // first have to get
      .get('/blog-posts')
      .then(function( res) {
        const updatedPost = Object.assign(res.body[0], {
          title: 'First Hackathon',
          content: 'It forced me to learn a lot'
        });
        return chai.request(app)
        .put(`/blog-posts/${res.body[0].id}`)
        .send(updatedPost)
        .then(function(res) {
          res.should.have.status(204);
        });
      });
    });

  it('should delete posts on DELETE', function() {
    return chai.request(app)
      // first have to get
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
        .delete(`/blog-posts/${res.body[0].id}`)
        .then(function(res) {
          res.should.have.status(204);
        });
      });
    });


});