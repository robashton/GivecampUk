var QA = function (couchdb) {
    db = couchdb;

    this.createTags = function (_tags) {
        db.save(
    {
        _id: "tagList",
        type: "tags",
        tags: _tags
    }, function (err, doc) { });
    }

    this.createQuestion = function (id, _userId, _title, _description, _tags) {
        db.save(
    {
        _id: id,
        type: "question",
        user: _userId,
        date: new Date(),
        deleted: 0,
        title: _title,
        description: _description,
        tags: _tags,
    }, function (err, doc) { });
    }

    this.createAnswer = function (id, _questionId, _userId, _answer) {
        db.save(
    {
        _id: id,
        type: "answer",
        questionId: _questionId,
        userId: _userId,
        answer: _answer,
        rank: 0,
        deleted: 0,
        date: new Date(),
        isAnswer:false,
        markedAsAnswerOn:null,
        markedAsAnswerBy:null,
        votes:0
    }, function (err, doc) { });
    }

    this.CreateAnswerViews = function () {
        db.save(, function (err, doc) { });


      db.save(, function(err, doc) {});

    }

    this.CreateQuestionViews = function () {
        db.save(, function (err, doc) { });
db.save(),function(err,doc) {});
    }

}

app.listen(8081);

console.log("Listening on port 8081");
