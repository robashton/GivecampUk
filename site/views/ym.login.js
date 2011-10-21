var loginModel = {

    registerForm: {
        username: ko.observable(),
        displayName: ko.observable(),
        password: ko.observable(),

        submit: function(event){
            alert('Hi ' + this().registerForm.username());
        }
    },

    loginForm: {
        username: ko.observable(),
        password: ko.observable(),

        submit: function(event){
            alert('Hi ' + this().loginForm.username());
        }
    }

};