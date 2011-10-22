var createTags = true;
var createDummyQuestion = true;
var createDummyAnswers = true;
var createQuestionViews = true;
var createAnswerViews = true;

http = require('http'),
path = require('path'),

fs = require('fs'),
startup = require('../startup');

DB_CONFIG_FILE = "config/db.json"

ENV = startup.get_env()
startup.check_config_exists(DB_CONFIG_FILE)

var express = require('express');

var app = express.createServer();

app.get('/db_create', function (req, res) {
    var CouchClient = require('couch-client');
    var qa = new QA(CouchClient('http://localhost:5984/youngmindsdb'));
    var questionId = generateGuid();
    if (createTags) qa.createTags([{ tagName: "Behaviour", description: "her behaviour has changed so much in the past three months." }, { tagName: "Emotional", description: "she has been very emotional lately and cries for the slightest thing" }, { tagName: "Mental health/Mentally ill", description: "they say she has got mental health problems and has got to see a psychologist" }, { tagName: "Refusing help", description: "he wont go to the doctor or speak to anyone" }, { tagName: "Aggressive", description: "she is very aggressive and shouts and screams at me – we are so worried that she is going to hurt someone" }, { tagName: "Angry", description: "he is angry all the time – we cant talk to him its like  treading on eggshells" }, { tagName: "Violent", description: "he has become so violent towards us we are scared of him" }, { tagName: "Depressed", description: "i think he is depressed he stays in his room and sleeps all day then is up all night" }, { tagName: "Depression", description: "the GP says she is depressed and needs to take medication. I dont want her on take anti-depressants." }, { tagName: "Anxiety /Anxious", description: "she’s anxious all the time and worries about everything" }, { tagName: "Sad", description: "since I divorced his father he’s so sad all the time  and says life is not worth living" }, { tagName: "Counselling", description: "we want to get her counselling but do not know where to get this for her" }, { tagName: "Withdrawn", description: "she withdrawn and  doesn’t want to go out with her friends any more" }, { tagName: "Self harming", description: "she is cutting her arms there are little cut marks on both her arms" }, { tagName: "Disruptive", description: "his teacher says he is very disruptive in class and doesn’t do as he is told" }, { tagName: "Destructive", description: "he’s smashed up his room  kicked holes in his bedroom door" }, { tagName: "Cutting", description: "we found out he is cutting his arms with a razor blade – we found the razors under his bed" }, { tagName: "Refusing school/School refusing", description: "we cant get her to school – she hates school" }, { tagName: "Autism/Aspergers", description: "i think my son has autism he seems so different from the other little boys in his class" }, { tagName: "Dyslexia", description: "he has an SEN statement to help him with his work at school but he is very angry and feels different from his friends" }, { tagName: "Bullying", description: "we have asked school to help but she is still getting bullied – they even bully her on Facebook and send her horrible texts" }, { tagName: "Psychosis", description: "she is hearing voices" }, { tagName: "Bipolar", description: "the professional says she may have bipolar because her moods are all over the place" }, { tagName: "Schizophrenia", description: "i think he is schizophrenic he says odd random things that make no sense and are not real" }, { tagName: "CAMHS", description: "the GP made a referral to CAMHS (child and adolescent mental health services) but there is a long waiting list . we dont know what to do to help support him" }, { tagName: "Counselling", description: "i think he needs counselling" }, { tagName: "Psychiatrist", description: "he has an appointment to see a psychiatrist in two weeks we are so worried what they are going to say." }, { tagName: "Suicide/Suicidal", description: "she says she wants to die" }, { tagName: "Overdose", description: "my daughter took an overdose and we had to take her to A&E" }, { tagName: "ADHD", description: "i think he has ADHD – he doesn’t  do as he is told and is taking risks and getting in with the wrong crowd" }, { tagName: "ODD", description: "they say he has ODD (oppositional defiant disorder) we dont know how to control his behaviour" }, { tagName: "Obsessions", description: "he seems obsessed with things" }, { tagName: "Addicted", description: "he is always on the computer we cant get him off" }, { tagName: "Phobia", description: "she’s scared of dogs and freaks out and has  panic attacks when she see’s them when we are out." }, { tagName: "OCD", description: "she keeps washing her hands and wants to control everything" }, { tagName: "Bereavement", description: "her grandmother died three months ago and they were really close" }, { tagName: "Stress", description: "she seems stressed out about everything" }, { tagName: "Exams", description: "my son is taking his exams and he is really stressed out at the moment I dont know how to help him" }, { tagName: "Eating disorder", description: "i think my daughter has an eating disorder" }, { tagName: "Anorexia", description: "she says she is fat and eats very little and counting all the calories" }, { tagName: "Bulimia", description: "she is making herself sick after meals" }, { tagName: "Tantrums – when you tell him off – he throws himself on the floor" }, { tagName: "Out of control – we cant manage her behaviour any more and she is out of control"}]);
    if (createDummyQuestion) qa.createQuestion(questionId, 1, "Whats my name", "Whats my name......", [{ tagName: "Tag1" }, { tagName: "Tag2" }, { tagName: "Tag3"}]);
    if (createDummyAnswers) { for (i = 0; i < 5; i++) qa.createAnswer(generateGuid(), questionId, 1, "this is my answer"); }
    if (createAnswerViews) qa.CreateAnswerViews();
    if (createQuestionViews) qa.CreateQuestionViews();
    res.json({ success: true }, {}, 200);
});

function generateGuid() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


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
        tags: _tags
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
        date: new Date()
    }, function (err, doc) { });
    }

    this.CreateAnswerViews = function () {
        db.save({
            _id: "_design/answers",
            language: "javascript",
            views: {
                byQuestion: {
                    map: "function(doc) {\n    var d = new Date(doc.date);\n    if (doc.type && doc.type == \"answer\" &&  \n\t(!doc.deleted || doc.deleted==0)) \n\t{\n        \temit(\n\t\t\t[\n\t\t\t\tdoc.questionId, \n\t\t\t\td.getFullYear(), \n\t\t\t\td.getMonth()+1, \n\t\t\t\td.getDate(), \n\t\t\t\td.getHours(), \n\t\t\t\td.getMinutes(), \n\t\t\t\tdoc._id\n\t\t\t]\n\t\t\t,doc);\n        }\n}"
                },
                countByQuestion: {
                    map: "function(doc) {\n  if(doc.type && doc.type==\"answer\" && (!doc.deleted || doc.deleted==-0))\n  emit([doc.questionId], 1);\n}",
                    reduce: "function (key, values, rereduce) {\n    return sum(values);\n}"
                }
            }
        }, function (err, doc) { });
    }

    this.CreateQuestionViews = function () {
        db.save({
            _id: "_design/questions",
            language: "javascript",
            views: {
                homepage: {
                    map: "function(doc) {\n    var d = new Date(doc.date);\n    if (doc.type && doc.type == \"question\" && \n\t (!doc.deleted || doc.deleted==0)) \n\t{\n            emit(\n\t\t[\n\t\t\td.getFullYear(), \n\t\t\td.getMonth()+1, \n\t\t\td.getDate(), \n\t\t\td.getHours(), \n\t\t\td.getMinutes(), \n\t\t\tdoc._id\n\t\t],\n\t\t[\n\t\t\tdoc.title, \n\t\t\tdoc.description, \n\t\t\tdoc.date, \n\t\t\tdoc.user]);\n        }\n}"
                },
                byQuestion: {
                    map: "function(doc) {\n    var d = new Date(doc.date);\n    if (doc.type && doc.type == \"question\" &&  \n\t(!doc.deleted || doc.deleted==0)) \n\t{\n       \t\temit(\n\t\t\t[\n\t\t\t\tdoc._id, \n\t\t\t\td.getFullYear(), \n\t\t\t\td.getMonth()+1, \n\t\t\t\td.getDate(), \n\t\t\t\td.getHours(), \n\t\t\t\td.getMinutes(), \n\t\t\t\tdoc._id\n\t\t\t]\n\t\t\t,doc\n\t\t   );\n        }\n}"
                }
            }
        }, function (err, doc) { });
    }
}

app.listen(8081);

console.log("Listening on port 8081");
