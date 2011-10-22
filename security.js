Cookies = require('cookies');
db = require('./db');
encryption = require('./encryption');

exports.validateUser = function(req, res, next) {
  var cookies = new Cookies( req, res );
  var username = cookies.get( "username" );

  if(!username) {
   res.json({ success: false}, {}, 401); 
  }
  else next();
};

exports.signInUser = function(req, res, email, password) {
   db.get_user(email,function(doc){
   if(doc.total_rows = 1){
     console.log(doc.total_rows);
     encryption.compare(password,doc.rows[0].value.password,function(result){
     if(!result){
       res.json({ success: false}, {}, 401); 
       }else{ 
       var cookies = new Cookies( req, res );
       cookies.set( "username", email, { httpOnly: false } );
       res.json({success: true},{},200);
     }}); 
   }
});
};

exports.signOutUser = function(req, res) {
   var cookies = new Cookies( req, res );
   cookies.set( "username", null, { httpOnly: false } );
};
