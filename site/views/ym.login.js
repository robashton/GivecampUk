var loginModel = {

    registerForm: {
        email: ko.observable(''),
        displayName: ko.observable(''),
        password: ko.observable(''),

        submit: function(event){
            var form = this().registerForm;
            $.post('register', {email: form.email,name: form.displayName, password: form.password }).success(function(data){
               if(data.success) {
                  viewModel.authenticated(true);
                  viewModel.doOnAuth();
              }
            });
        }
    },

    loginForm: {
        email: ko.observable(''),
        password: ko.observable(''),

        submit: function(event){

            var form = this().loginForm;

            $.post('login', { email: form.email(), password: form.password() }).success(function(data){
                if(data.success) {
                  viewModel.authenticated(true);
                  viewModel.displayName(data.name);
                  viewModel.doOnAuth();
                }
            });
        }
    }
};

loginModel.loginForm.valid = ko.dependentObservable(function(){
 return true;        
//return this.loginForm.email().length > 0 && this.loginForm.password().length > 0;
}, loginModel);
