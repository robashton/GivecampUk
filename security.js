Cookies = require('cookies');


exports.validateUser = function(req, res, next) {
  var cookies = new Cookies( req, res );
  var username = cookies.get( "username" );

  if(!username) {
   res.json({ success: false}, {}, 401); 
  }
  else next();
};

exports.signInUser = function(req, res, username, password) {
   var cookies = new Cookies( req, res );
   cookies.set( "username", username, { httpOnly: false } );
};

exports.signOutUser = function(req, res) {
   var cookies = new Cookies( req, res );
   cookies.set( "username", null, { httpOnly: false } );
};
