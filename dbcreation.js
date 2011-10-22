var express = require('express');
var security = require('./security');

var url = config(DB_CONFIG_FILE);
var utils = require('./utils');
var encryption = require('./encryption');

var url = config(DB_CONFIG_FILE)
var CouchClient = require('couch-client');
var db = CouchClient(url);
var dbapi = require('./db');

exports.init = function(app) {
  
  app.get('/dbcreate', function(req, res){
    createDatabase();
    res.json({success: 'probably'});
    res.end();
  });
};


function createDatabase(){
  createData();
  createViews();
};

function createData() {
  createTags();
  createUsers();
};

function createViews() {
  for(i in views) {
    var view = views[i];
    db.save(view, function(err, doc) {
      
    });
  }
};

function createUsers() {
    encryption.hash("password", function(hash){

    db.save({_id: "test", name: "Tim Caswell", age: 28, email: "Tim.Caswell@gmail.com", password: hash, type: "user", isElevated: false}, function ( err, doc) {
      // You know know if there was an error and have an updated version
      // of the document (with `_id` and `_rev`).
    });
  })
};

function createTags() {
  db.save({
      _id: "tagList",
      type: "tags",
      tags: [{ tagName: "Behaviour", description: "her behaviour has changed so much in the past three months." }, { tagName: "Emotional", description: "she has been very emotional lately and cries for the slightest thing" }, { tagName: "Mental health/Mentally ill", description: "they say she has got mental health problems and has got to see a psychologist" }, { tagName: "Refusing help", description: "he wont go to the doctor or speak to anyone" }, { tagName: "Aggressive", description: "she is very aggressive and shouts and screams at me – we are so worried that she is going to hurt someone" }, { tagName: "Angry", description: "he is angry all the time – we cant talk to him its like  treading on eggshells" }, { tagName: "Violent", description: "he has become so violent towards us we are scared of him" }, { tagName: "Depressed", description: "i think he is depressed he stays in his room and sleeps all day then is up all night" }, { tagName: "Depression", description: "the GP says she is depressed and needs to take medication. I dont want her on take anti-depressants." }, { tagName: "Anxiety /Anxious", description: "she’s anxious all the time and worries about everything" }, { tagName: "Sad", description: "since I divorced his father he’s so sad all the time  and says life is not worth living" }, { tagName: "Counselling", description: "we want to get her counselling but do not know where to get this for her" }, { tagName: "Withdrawn", description: "she withdrawn and  doesn’t want to go out with her friends any more" }, { tagName: "Self harming", description: "she is cutting her arms there are little cut marks on both her arms" }, { tagName: "Disruptive", description: "his teacher says he is very disruptive in class and doesn’t do as he is told" }, { tagName: "Destructive", description: "he’s smashed up his room  kicked holes in his bedroom door" }, { tagName: "Cutting", description: "we found out he is cutting his arms with a razor blade – we found the razors under his bed" }, { tagName: "Refusing school/School refusing", description: "we cant get her to school – she hates school" }, { tagName: "Autism/Aspergers", description: "i think my son has autism he seems so different from the other little boys in his class" }, { tagName: "Dyslexia", description: "he has an SEN statement to help him with his work at school but he is very angry and feels different from his friends" }, { tagName: "Bullying", description: "we have asked school to help but she is still getting bullied – they even bully her on Facebook and send her horrible texts" }, { tagName: "Psychosis", description: "she is hearing voices" }, { tagName: "Bipolar", description: "the professional says she may have bipolar because her moods are all over the place" }, { tagName: "Schizophrenia", description: "i think he is schizophrenic he says odd random things that make no sense and are not real" }, { tagName: "CAMHS", description: "the GP made a referral to CAMHS (child and adolescent mental health services) but there is a long waiting list . we dont know what to do to help support him" }, { tagName: "Counselling", description: "i think he needs counselling" }, { tagName: "Psychiatrist", description: "he has an appointment to see a psychiatrist in two weeks we are so worried what they are going to say." }, { tagName: "Suicide/Suicidal", description: "she says she wants to die" }, { tagName: "Overdose", description: "my daughter took an overdose and we had to take her to A&E" }, { tagName: "ADHD", description: "i think he has ADHD – he doesn’t  do as he is told and is taking risks and getting in with the wrong crowd" }, { tagName: "ODD", description: "they say he has ODD (oppositional defiant disorder) we dont know how to control his behaviour" }, { tagName: "Obsessions", description: "he seems obsessed with things" }, { tagName: "Addicted", description: "he is always on the computer we cant get him off" }, { tagName: "Phobia", description: "she’s scared of dogs and freaks out and has  panic attacks when she see’s them when we are out." }, { tagName: "OCD", description: "she keeps washing her hands and wants to control everything" }, { tagName: "Bereavement", description: "her grandmother died three months ago and they were really close" }, { tagName: "Stress", description: "she seems stressed out about everything" }, { tagName: "Exams", description: "my son is taking his exams and he is really stressed out at the moment I dont know how to help him" }, { tagName: "Eating disorder", description: "i think my daughter has an eating disorder" }, { tagName: "Anorexia", description: "she says she is fat and eats very little and counting all the calories" }, { tagName: "Bulimia", description: "she is making herself sick after meals" }, { tagName: "Tantrums – when you tell him off – he throws himself on the floor" }, { tagName: "Out of control – we cant manage her behaviour any more and she is out of control"}]
  });
};

var views = [
    {
           "_id": "_design/answers",
           "_rev": "1-88fcc9fc42f1a3da7e6b4f8fe2bf6a77",
           "language": "javascript",
           "views": {
               "by_questionid": {
                   "map": "function(doc) {\n  if(doc.type === \"answer\")\n  \temit(doc.questionId, doc);\n}"
               }
           }
      },
      {
         "_id": "_design/users",
         "_rev": "1-e3759fe60738e4307a3d878732cf2005",
         "language": "javascript",
         "views": {
             "by_email": {
                 "map": "function(doc) {\n  if(doc.type == \"user\")\n     emit(doc.email, doc);\n}"
             }
         }
      },
      {
       "_id": "_design/questions",
       "_rev": "1-a2f4cfdc23ca678ae37879b20fda997b",
       "language": "javascript",
       "views": {
           "by_tag": {
               "map": "function(doc) {\n  if(doc.type === \"question\")\n  \temit(doc.tag, doc);\n}"
           }
       }
},
        {
   "_id": "_design/Answers",
   "_rev": "1-93ce9a729c6f3a7b99b1710b8b1f8639",
   "language": "javascript",
   "views": {
       "by_rank": {
           "map": "function(doc) {\n  emit(doc.rank, doc);\n}"
       }
   }

    }

];
