var viewQuestionModel = {
      id: ko.observable(''),
      title: ko.observable(''),
      description: ko.observable(''),

      init: function() {
        $.getJSON('/question/' + viewQuestionModel.id(), function(data) {   
            if(data.error) console.log(data.error);         
            viewQuestionModel.title(data.question.title);
            viewQuestionModel.description(data.question.description);
        });
      },   
};
