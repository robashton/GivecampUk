var loginModel = {

    registerForm: {
        email: ko.observable(''),
        displayName: ko.observable(''),
        password: ko.observable(''),
        registrationError: ko.observable(''),

        submit: function(event){
            var form = loginModel.registerForm;
            $.post('register', {email: form.email,name: form.displayName, password: form.password }).success(function(data){
               if(data.success) {
                  window.location = 'index.html';
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

            $.post('login', { email: form.email(), password: form.password() }).success(function(data){
                if(data.success) {
                  window.location = 'index.html';
                }
            });
        }
    }
};

loginModel.loginForm.valid = ko.dependentObservable(function(){
 return true;        
//return this.loginForm.email().length > 0 && this.loginForm.password().length > 0;
}, loginModel);
