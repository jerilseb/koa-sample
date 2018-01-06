const chai = require("chai");
const chaiHttp = require("chai-http");
const { readFileSync } = require("fs");
const server = require("../app");

const should = chai.should();
chai.use(chaiHttp);
const TIMEOUT = 1000;

describe("routes : index", function indexTest() {
  this.timeout(TIMEOUT);

  describe("GET /status", () => {
    it("server should be running", done => {
      chai
        .request(server)
        .get("/status")
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql("application/json");
          done();
        });
    });
  });

  describe("POST /findwords", () => {
    it("api should return bad request without dictionary file", done => {
      chai
        .request(server)
        .post("/findwords")
        .end((err, res) => {
          res.status.should.eql(400);
          done();
        });
    });

    it("api should return bad request with wrong dictionary filename", done => {
      chai
        .request(server)
        .post("/findwords")
        .attach("test", readFileSync("test/data/words.txt"), "words.txt")
        .end((err, res) => {
          res.status.should.eql(400);
          done();
        });
    });

    it("api should return success with correct dictionary filename", done => {
      chai
        .request(server)
        .post("/findwords")
        .attach("dict", readFileSync("test/data/words.txt"), "words.txt")
        .end((err, res) => {
          res.status.should.eql(200);
          done();
        });
    });

    it("api should handle blank files", done => {
      chai
        .request(server)
        .post("/findwords")
        .attach("dict", readFileSync("test/data/empty.txt"), "empty.txt")
        .end((err, res) => {
          res.status.should.eql(200);
          res.body.count.should.eql(0);
          done();
        });
    });

    it("api should find all the matches", done => {
      chai
        .request(server)
        .post("/findwords")
        .attach("dict", readFileSync("test/data/small.txt"), "small.txt")
        .end((err, res) => {
          res.status.should.eql(200);
          res.body.count.should.eql(9);
          done();
        });
    });

    it("api should be case insensitive", done => {
      chai
        .request(server)
        .post("/findwords")
        .attach("dict", readFileSync("test/data/case.txt"), "case.txt")
        .end((err, res) => {
          res.status.should.eql(200);
          res.body.count.should.eql(3);
          done();
        });
    });

    it("api should ignore duplicates", done => {
      chai
        .request(server)
        .post("/findwords")
        .attach(
          "dict",
          readFileSync("test/data/duplicate.txt"),
          "duplicate.txt"
        )
        .end((err, res) => {
          res.status.should.eql(200);
          res.body.count.should.eql(5);
          done();
        });
    });

    it("api should work with unicode characters", done => {
      chai
        .request(server)
        .post("/findwords")
        .attach(
          "dict",
          readFileSync("test/data/unicode.txt"),
          "unicode_bmp.txt"
        )
        .end((err, res) => {
          res.status.should.eql(200);
          res.body.count.should.eql(4);
          done();
        });
    });

    it("api should process large files in a reasonable time", done => {
      chai
        .request(server)
        .post("/findwords")
        .attach("dict", readFileSync("test/data/large.txt"), "large.txt")
        .end((err, res) => {
          res.status.should.eql(200);
          done();
        });
    });

    it("api should not accept files bigger than 1mb", done => {
      chai
        .request(server)
        .post("/findwords")
        .attach("dict", readFileSync("test/data/bigfile"), "bigfile")
        .end((err, res) => {
          res.status.should.eql(400);
          done();
        });
    });
  });
});
