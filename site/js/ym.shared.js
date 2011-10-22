var views = {
    login: loginModel,
    question: questionModel,
    questions: questionsModel,
    viewquestion: viewQuestionModel,
    tags: tagadminModel,
    admin: adminModel,
    tagadmin: tagadminModel,
    admin:adminModel,
    viewquestion: viewQuestionModel
};

var viewModel = {
    authenticated: ko.observable(false),
    doOnAuth: null,
    email: ko.observable(),
    displayName: ko.observable(),
    currentView: ko.observable('login')
};

viewModel.currentViewModel = ko.dependentObservable(function(){
    return views[viewModel.currentView()];
});

viewModel.currentViewModel.subscribe(function() {
    if(viewModel.currentViewModel() && viewModel.currentViewModel().init){
        viewModel.currentViewModel().init();
    }
});

$(function(){

    $.routes({
      "/": function() {
          viewModel.currentView('questions');
      },
      "/ask": function() {
          viewModel.currentView('question');
      },
      "/question/:id": function(params) {
          var id = params.id;
          viewQuestionModel.id(id);
          viewModel.currentView('viewquestion');
      },
      "/admin": function() {
        viewModel.currentView('admin');
      }, 
      "/tagadmin": function() {
        viewModel.currentView('tagadmin');
      },
      "/logout": function() {
        viewModel.authenticated(false);
        viewModel.email(null);
        viewModel.currentView('login');
        $.routes("set","/");
      }
    });

    $.routes.dispatcher = function(callback,params,path){
        if(viewModel.authenticated()) {
            callback(params);
        } else {
            viewModel.doOnAuth = function(){
                callback(params);
            };
            viewModel.currentView('login');
            $.get('currentuser').success(function(){
                viewModel.doOnAuth();
            });
        }
    };

    ko.ExternaljQueryTemplateEngine.prototype = new ko.templateEngine();
    ko.externaljQueryTemplateEngine = new ko.ExternaljQueryTemplateEngine();
    ko.externaljQueryTemplateEngine.templateUrl = 'templates';
    ko.setTemplateEngine(ko.externaljQueryTemplateEngine);
    ko.applyBindings(viewModel.currentViewModel);
});

