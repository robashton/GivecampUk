Cookies = require('cookies');
db = require('./db');
encryption = require('./encryption');

exports.validateUser = function(req, res, next) {
  var cookies = new Cookies( req, res );
  var session_cookie = cookies.get( "ymindsid" );

  if(!session_cookie) {
   res.json({ success: false}, {}, 401); 
  }
  else{
    //TODO: session db validation
    console.log(session_cookie);
    next();
  }
};

exports.signInUser = function(req, res, email, password, callback) {
  
   db.get_user(email, function(err,doc){
     if(doc.error == undefined && doc.rows.length > 0){
       encryption.compare(password, doc.rows[0].value.password, function(result) {
       db.create_session(doc.rows[0].value._id,doc.rows[0].value.email,function(guid){
          if(err == undefined){
            callback(result,guid,doc.rows[0].value.name);
          } else {
            callback(false,undefined,undefined);
          }
       });
       }); 
     }
   });
};

exports.signOutUser = function(req, res) {
   var cookies = new Cookies( req, res );
   cookies.set( "ymindsid", null, { httpOnly: false } );
};
