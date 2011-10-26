var viewModel = {
    authenticated: ko.observable(false),
    isElevated: ko.observable(false),
    email: ko.observable(),
    displayName: ko.observable(),
    currentUser: ko.observable(),
    currentView: ko.observable({ template: 'dsds' })
};

$(function() {

    $('.topbar .nav li').click(function() {

        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    });

    var templateEngine = new ko.jqueryTmplTemplateEngine();
    templateEngine.makeTemplateSource = function(template) {
        // Named template
        if (typeof template == "string") {
            var node = document.getElementById(template);
            if (node == null) {
                var templateHtml = null;

                $.ajax({
                    async: false,
                    url:'templates/' + template + '.html',
                    dataType: "html",
                    type: "GET",
                    timeout: 0,
                    success: function(response) {
                        templateHtml = response;
                    },
                    error: function(exception) {
                        if (this['useDefaultErrorTemplate'])
                            templateHtml = this['defaultErrorTemplateHtml'].replace('{STATUSCODE}', exception.status).replace('{TEMPLATEID}', templateId).replace('{TEMPLATEURL}', templatePath);
                    }.bind(this)
                });

                if (templateHtml === null)
                    throw new Error("Cannot find template with ID=" + template);

                var node = document.createElement("script");
                node.type = "text/html";
                node.id = template;
                node.text = templateHtml;
                document.body.appendChild(node);
            }
            return new ko.templateSources.domElement(node);
        } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
            // Anonymous template
            return new ko.templateSources.anonymousTemplate(template);
        } else
            throw new Error("Unrecognised template type: " + template);
    }
    ko.setTemplateEngine(templateEngine);

    $.get('currentuser').success(
        function(currentUser) {
            viewModel.authenticated(true);
            viewModel.currentUser(currentUser);
            viewModel.isElevated(currentUser.isElevated);
            viewModel.displayName(currentUser.displayName);

            $.routes({
                "/": function() {
                    viewModel.currentView(new ViewQuestionsModel());
                },
                "/tag/:tag": function(params) {
                    viewModel.currentView(new ViewQuestionsModel(params.tag));
                },
                "/ask": function() {
                    viewModel.currentView(new AskQuestionModel());
                },
                "/question/:id": function(params) {
                    viewModel.currentView(new ViewQuestionModel(params.id));
                },
                "/tagadmin": function() {
                    if (viewModel.isElevated())
                        viewModel.currentView(new TagAdminModel());
                },
                "/useradmin": function() {
                    if (viewModel.isElevated())
                        viewModel.currentView(new UserAdminModel());
                }
            });

            jQuery.validator.setDefaults({
                errorPlacement: function(error, element) {
                    error.insertAfter(element);
                    error.addClass('help-inline');
                },
                errorElement: 'span'
            });

            ko.applyBindings(viewModel.currentView);

        }).error(function() {
            document.location.href = '/login.html';
        });
    ;
});

