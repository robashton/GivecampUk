var views = {
    question: questionModel,
    questions: questionsModel,
    viewquestion: viewQuestionModel,
    tags: tagadminModel,
    admin: adminModel,
    tagadmin: tagadminModel,
    admin:adminModel,
    viewquestion: viewQuestionModel,
    useradmin: useradminModel

};

var viewModel = {
    authenticated: ko.observable(false),
    isElevated: ko.observable(false),
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

    $.get('currentuser').success(function(){
      viewModel.authenticated(true);

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
      "/useradmin": function() {
          viewModel.currentView('useradmin');
        },
        "/logout": function() {
          $.get('logout');
          viewModel.authenticated(false);
          viewModel.email(null);
          viewModel.currentView('login');
          window.location = 'index.html';
        }
      });

      jQuery.validator.setDefaults({
        errorPlacement: function(error, element) {
            error.insertAfter(element);
            error.addClass('help-inline');
        },
        errorElement: 'span'
      });

      ko.ExternaljQueryTemplateEngine.prototype = new ko.templateEngine();
      ko.externaljQueryTemplateEngine = new ko.ExternaljQueryTemplateEngine();
      ko.externaljQueryTemplateEngine.templateUrl = 'templates';
      ko.setTemplateEngine(ko.externaljQueryTemplateEngine);
      ko.applyBindings(viewModel.currentViewModel);

    }).error(function(){ 
      document.location.href = '/index.html';
    });;
});

