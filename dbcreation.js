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
  createQuestions();
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
    db.save({_id: "testuser1", name: "Tim Caswell", age: 28, email: "tim.caswell@gmail.com", password: hash, type: "user", isElevated: false}, function ( err, doc) {});

    db.save({_id: "testuser2", name: "Nick", age: 28, email: "test@nick.com", password: hash, type: "user", isElevated: false}, function ( err, doc) {});
    db.save({_id: "testadmin1", name: "Admin", age: 28, email: "admin", password: hash, type: "user", isElevated: true}, function ( err, doc) {});
  })
};

function createQuestions(){
  db.save({
   "_id": "testquestion1",
   "type": "question",
   "user": "Tim.Caswell@gmail.com",
   "displayname": "Tim Caswell",
   "date": "2011-10-23T08:34:59.924Z",
   "deleted": 0,
   "title": "Does sport help depression?",
   "description": "Hi,\n\nmy son suffers from clinical depression, would sport help him feel better?\n\nThanks",
   "tag": {
       "tagName": "Depression",
       "description": "the GP says she is depressed and needs to take medication. I dont want her on take anti-depressants."
   }
});
  db.save({
   "_id": "testanswer1",
   "type": "answer",
   "questionId": "testquestion1",
   "userId": "testuser2",
   "displayname": "Nick",
   "upvotes": [],
   "downvotes": [],
   "answer": "sport has got a massive capacity to improve the lives of people suffering from mental health problems because physical activity is good for mental health, whether you have a mental health problem or not. Sport provides a forum for social interaction",
   "rank": 0,
   "date": "2011-10-23T09:59:10.118Z"
});
}

function createTags() {
  db.save({
      _id: "tagList",
      type: "tags",
      tags: [{ tagName: "Behaviour", description: "her behaviour has changed so much in the past three months." }, { tagName: "Emotional", description: "she has been very emotional lately and cries for the slightest thing" }, { tagName: "Mental health/Mentally ill", description: "they say she has got mental health problems and has got to see a psychologist" }, { tagName: "Refusing help", description: "he wont go to the doctor or speak to anyone" }, { tagName: "Aggressive", description: "she is very aggressive and shouts and screams at me – we are so worried that she is going to hurt someone" }, { tagName: "Angry", description: "he is angry all the time – we cant talk to him its like  treading on eggshells" }, { tagName: "Violent", description: "he has become so violent towards us we are scared of him" }, { tagName: "Depressed", description: "i think he is depressed he stays in his room and sleeps all day then is up all night" }, { tagName: "Depression", description: "the GP says she is depressed and needs to take medication. I dont want her on take anti-depressants." }, { tagName: "Anxiety /Anxious", description: "she’s anxious all the time and worries about everything" }, { tagName: "Sad", description: "since I divorced his father he’s so sad all the time  and says life is not worth living" }, { tagName: "Counselling", description: "we want to get her counselling but do not know where to get this for her" }, { tagName: "Withdrawn", description: "she withdrawn and  doesn’t want to go out with her friends any more" }, { tagName: "Self harming", description: "she is cutting her arms there are little cut marks on both her arms" }, { tagName: "Disruptive", description: "his teacher says he is very disruptive in class and doesn’t do as he is told" }, { tagName: "Destructive", description: "he’s smashed up his room  kicked holes in his bedroom door" }, { tagName: "Cutting", description: "we found out he is cutting his arms with a razor blade – we found the razors under his bed" }, { tagName: "Refusing school/School refusing", description: "we cant get her to school – she hates school" }, { tagName: "Autism/Aspergers", description: "i think my son has autism he seems so different from the other little boys in his class" }, { tagName: "Dyslexia", description: "he has an SEN statement to help him with his work at school but he is very angry and feels different from his friends" }, { tagName: "Bullying", description: "we have asked school to help but she is still getting bullied – they even bully her on Facebook and send her horrible texts" }, { tagName: "Psychosis", description: "she is hearing voices" }, { tagName: "Bipolar", description: "the professional says she may have bipolar because her moods are all over the place" }, { tagName: "Schizophrenia", description: "i think he is schizophrenic he says odd random things that make no sense and are not real" }, { tagName: "CAMHS", description: "the GP made a referral to CAMHS (child and adolescent mental health services) but there is a long waiting list . we dont know what to do to help support him" }, { tagName: "Counselling", description: "i think he needs counselling" }, { tagName: "Psychiatrist", description: "he has an appointment to see a psychiatrist in two weeks we are so worried what they are going to say." }, { tagName: "Suicide/Suicidal", description: "she says she wants to die" }, { tagName: "Overdose", description: "my daughter took an overdose and we had to take her to A&E" }, { tagName: "ADHD", description: "i think he has ADHD – he doesn’t  do as he is told and is taking risks and getting in with the wrong crowd" }, { tagName: "ODD", description: "they say he has ODD (oppositional defiant disorder) we dont know how to control his behaviour" }, { tagName: "Obsessions", description: "he seems obsessed with things" }, { tagName: "Addicted", description: "he is always on the computer we cant get him off" }, { tagName: "Phobia", description: "she’s scared of dogs and freaks out and has  panic attacks when she see’s them when we are out." }, { tagName: "OCD", description: "she keeps washing her hands and wants to control everything" }, { tagName: "Bereavement", description: "her grandmother died three months ago and they were really close" }, { tagName: "Stress", description: "she seems stressed out about everything" }, { tagName: "Exams", description: "my son is taking his exams and he is really stressed out at the moment I dont know how to help him" }, { tagName: "Eating disorder", description: "i think my daughter has an eating disorder" }, { tagName: "Anorexia", description: "she says she is fat and eats very little and counting all the calories" }, { tagName: "Bulimia", description: "she is making herself sick after meals" }, { tagName: "Tantrums", description: "when you tell him off – he throws himself on the floor" }, { tagName: "Out of control", description: "we cant manage her behaviour any more and she is out of control"}]
  });
};

var views = [
    {
           "_id": "_design/answers",
           "language": "javascript",
           "views": {
               "by_questionid": {
                   "map": "function(doc) {\n  if(doc.type === \"answer\")\n  \temit(doc.questionId, doc);\n}"
               }
           }
      },
      {
         "_id": "_design/users",
         "language": "javascript",
         "views": {
             "by_email": {
                 "map": "function(doc) {\n  if(doc.type == \"user\")\n     emit(doc.email, doc);\n}"
             },
         "getAllUsers": {
             "map": "function(doc) {\n  if(doc.type === \"user\")\n  \temit(doc._id, doc);\n}"
         }
         }
      },
      {
         "_id": "_design/questions",
         "_rev": "28-484c2322d6bc484a574043524d97cfcd",
         "language": "javascript",
         "views": {
             "by_tag": {
                 "map": "function(doc) {\n  if(doc.type === \"question\") {\n\t\n     emit([doc.tag.tagName, Date.parse(doc.date)],\n\t { \n\t   _id: doc._id + \"_count\",  \n\t   question: doc \n\t}); \n   }\n}"
             },
             "by_answercount": {
                 "map": "function(doc) {\n  if( doc.type !== 'answer' ) return;\n  emit(doc.questionId, 1);\n}",
                 "reduce": "function (key, values, rereduce) {\n    return sum(values)\n}"
             }
         }
      },
        {
         "_id": "_design/Answers",
         "language": "javascript",
         "views": {
             "by_rank": {
                 "map": "function(doc) {\n  emit(doc.rank, doc);\n}"
             }
         }
    },

    {
       "_id": "_design/tags",
       "language": "javascript",
       "views": {
           "by_popularity": {
               "map": "function(doc) {\n  if(doc.type === 'question' && doc.tag.tagName) {\n\temit(doc.tag.tagName, {\n\t\ttagDescription: doc.tag.description,\n\t\tcount: 1\n\t});\n\temit(\"All\", {\n\t\ttagDescription:\"all\",\n\t\tcount: 1\n\t});\n  }\n  else if(doc._id == 'tagList') {\n\tfor(var x = 0; x < doc.tags.length; x++)\n        {\n \t\temit(doc.tags[x].tagName, {\n\t\t\ttagDescription: doc.tags[x].description,\n\t\t\tcount: 1\n\t\t});\n        }\n  }\n}",
               "reduce": "function (key, values, rereduce) {\n\t\tvar total = 0;\n\t\tfor(var x = 0; x < values.length; x++){\n\t\t\ttotal += values[x].count;\n\t\t}\n\t\treturn {\n\t\t\ttagDescription: values[0].tagDescription,\n\t\t\tcount: total\n\t\t}\n}\t"
           }
       }
    }

];
