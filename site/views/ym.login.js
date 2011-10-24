var loginModel = {

    registerForm: {
        email: ko.observable(''),
        displayName: ko.observable(''),
        password: ko.observable(''),
        validationMessage: ko.observable(''),

        submit: function(event) {
            var form = loginModel.registerForm;
            if (!form.preSubmitValidate(form))
                return;
            $.post('register', {email: form.email() ,name: form.displayName(), password: form.password() }).success(function(data) {
                if (data.success) {
                    //window.location = 'index.html';
                    setTimeout(function() {
                        loginModel.doLogin(form);
                    }, 1500);
                    window.location = '/';
                } else {
                    loginModel.registerForm.validationMessage(data.error);
                }
            })
                .fail(function(data) {
                    loginModel.registerForm.validationMessage('Unexpected error from server. Please try again later.');
                });
        },

        preSubmitValidate: function(form) {
            var message = '';
            if (form.email().length < 1)
                message = message + 'Please provide an email address';
            if (form.displayName().length < 1)
                message = message + '\nPlease provide a display name';
            if (form.password().length < 1)
                message = message + '\nPlease provide a password';

            if (message.length > 0) {
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

        submit: function(event) {
            var form = loginModel.loginForm;
            loginModel.doLogin(form);
        }
    },

    //badness warning: this relies on loginForm and registerForm having same named members!
    doLogin: function(authForm) {
        $.post('login', { email: authForm.email(), password: authForm.password() }).success(function(data) {
            if (data.success) {
                window.location = '/';
            } else {
                authForm.validationMessage('Login failed. Please check username and password');
            }
        })
            .fail(function() {
                authForm.validationMessage('Login failed. Please check username and password');
            });
    },
};

loginModel.loginForm.valid = ko.dependentObservable(function() {
    return loginModel.loginForm.email().length > 0 && loginModel.loginForm.password().length > 0;
}, loginModel);

loginModel.registerForm.valid = ko.dependentObservable(function() {
    return loginModel.registerForm.email().length > 0 && loginModel.registerForm.password().length > 0 && loginModel.registerForm.displayName().length > 0;
}, loginModel);

loginModel.registerForm.hasValidationIssue = ko.dependentObservable(function() {
    return loginModel.registerForm.validationMessage().length > 0;
}, loginModel);

loginModel.loginForm.hasValidationIssue = ko.dependentObservable(function() {
    return loginModel.loginForm.validationMessage().length > 0;
}, loginModel);
