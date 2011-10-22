var loginModel = {

    registerForm: {
        username: ko.observable(''),
        displayName: ko.observable(''),
        password: ko.observable(''),

        submit: function(event){
            alert('Hi ' + this().registerForm.username());
            
        }
    },

    loginForm: {
        username: ko.observable(''),
        password: ko.observable(''),

        submit: function(event){

            var form = this().loginForm;

            $.post('login', { username: form.username(), password: form.password() }).success(function(data){
                if(data.success) {
                    alert('Yeah!');
                }
            });
        }
    }
};

loginModel.loginForm.valid = ko.dependentObservable(function(){
        return this.loginForm.username().length > 0 && this.loginForm.password().length > 0;
}, loginModel);