var loginModel = {

    registerForm: {
        email: ko.observable(''),
        displayName: ko.observable(''),
        password: ko.observable(''),
        validationMessage: ko.observable(''),

        submit: function(event){
            var form = loginModel.registerForm;
            if(!form.preSubmitValidate(form))
               return;
            $.post('register', {email: form.email() ,name: form.displayName(), password: form.password() }).success(function(data){
               if(data.success) {
                  //window.location = 'index.html';
                  setTimeout(function(){
                     loginModel.doLogin(form.email(), form.password());
                  }, 1500);
                  window.location = 'app.html';
              }else{
                  loginModel.registerForm.validationMessage(data.error);
              }
            });
        },

        preSubmitValidate: function(form){
           var message = '';
           if(form.email().length < 1)
              message = message + 'Please provide an email address';
           if(form.displayName().length < 1)
              message = message + '\nPlease provide a display name';
           if(form.password().length < 1)
              message = message + '\nPlease provide a password';

           if(message.length > 0){
              form.validationMessage(message);
              return false;
           }
           return true;
        }
    },

    loginForm: {
        email: ko.observable(''),
        password: ko.observable(''),
        validationMessage: ko.observable(''),

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
    },

    //we are overloading 'validation' here - covers auth/auth errors too
};

   loginModel.loginForm.valid = ko.dependentObservable(function(){
      return loginModel.loginForm.email().length > 0 && loginModel.loginForm.password().length > 0;
   }, loginModel);

   loginModel.registerForm.hasValidationIssue = ko.dependentObservable(function() {
      return loginModel.registerForm.validationMessage().length > 0;
   }, loginModel);

   loginModel.loginForm.hasValidationIssue = ko.dependentObservable(function() {
      return loginModel.loginForm.validationMessage().length > 0;
   }, loginModel);
