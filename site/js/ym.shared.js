var views = {
    login: loginModel
};

var viewModel = {
    user: ko.observable(),
    currentView: ko.observable('login')
};

viewModel.currentViewModel = ko.dependentObservable(function(){
    return views[viewModel.currentView()];
});

$(function(){

    var options = {
        templateUrl: 'templates'
    };

    ko.ExternaljQueryTemplateEngine.prototype = new ko.templateEngine();
    // Giving you an easy handle to set member values like templateUrl, templatePrefix and templateSuffix.
    ko.externaljQueryTemplateEngine = new ko.ExternaljQueryTemplateEngine(options);
    ko.externaljQueryTemplateEngine.templateUrl = 'templates';
    // overrides the default template engine KO normally wires up.
    ko.setTemplateEngine(ko.externaljQueryTemplateEngine);


    
    ko.applyBindings(viewModel);
});

