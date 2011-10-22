var loginModel = {

    registerForm: {
        email: ko.observable(''),
        displayName: ko.observable(''),
        password: ko.observable(''),

        submit: function(event){
            var form = this().registerForm;
            $.post('register', {email: form.email,name: form.displayName, password: form.password }).success(function(data){
               if(data.success) {

               }
            });
        }
    },

    loginForm: {
        email: ko.observable(''),
        password: ko.observable(''),

        submit: function(event){

            var form = this().loginForm;

            viewModel.authenticated(true);
            viewModel.email('user');
            viewModel.displayName('Joe Bloggs');
            viewModel.doOnAuth();

            $.post('login', { email: form.email(), password: form.password() }).success(function(data){
                if(data.success) {
                    $.get('currentuser').success(function(data) {
                        //TODO: set cookie
                        viewModel.authenticated(true);
                        viewModel.email(data.email);
                    });
                }
            });
        }
    }
};

loginModel.loginForm.valid = ko.dependentObservable(function(){
        return this.loginForm.email().length > 0 && this.loginForm.password().length > 0;
}, loginModel);
