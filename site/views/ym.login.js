var loginModel = {

    registerForm: {
        email: ko.observable(''),
        displayName: ko.observable(''),
        password: ko.observable(''),
        registrationError: ko.observable(''),

        submit: function(event){
            var form = loginModel.registerForm;
            $.post('register', {email: form.email() ,name: form.displayName(), password: form.password() }).success(function(data){
               if(data.success) {
                  //window.location = 'index.html';
                  setTimeout(function(){
                     loginModel.doLogin(form.email(), form.password());
                  }, 1500);
                  window.location = 'app.html';
              }else{
                  loginModel.registerForm.registrationError(data.error);
              }
            });
        }
    },

    loginForm: {
        email: ko.observable(''),
        password: ko.observable(''),

        submit: function(event){
            var form = loginModel.loginForm;
            loginModel.doLogin(form.email(), form.password());
        }
    },

    doLogin: function(emailAddress, password){
        $.post('login', { email: emailAddress, password: password }).success(function(data){
            if(data.success) {
              window.location = 'app.html';
            }
        });
    }
};

$(function(){
   loginModel.loginForm.valid = ko.dependentObservable(function(){
   return loginModel.loginForm.email().length > 0 && loginModel.loginForm.password().length > 0;
   }, loginModel);
});
