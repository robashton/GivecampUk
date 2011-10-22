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

            var form = this().loginForm;

            $.post('login', { username: form.username(), password: form.password() }).success(function(data){
                if(data.success) {
                    alert('Yeah!');
                }
            });
        }
    }

};