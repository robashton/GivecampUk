var viewQuestionModel = {
      id: ko.observable(''),
      title: ko.observable(''),
      description: ko.observable(''),
      displayname: ko.observable(''),
      date: ko.observable(''),
      answers: ko.observableArray([]),
      url: ko.observable(''),

      newAnswerForm: {
        answer: ko.observable(''),
  
        submit: function(event){
            if($('#newAnswerForm').valid()){
                var form = viewQuestionModel.newAnswerForm;
                $.post('answer', {
                  question_id: viewQuestionModel.id,
                  answer_text: form.answer()
                }).success(function(data) {
                    form.answer('');
                    viewQuestionModel.answers.push({ value: data });
                });
            }
        }
      },
      

      init: function() {
        $.getJSON('/question/' + viewQuestionModel.id(), function(data) {   
            if(data.error) console.log(data.error);         
            viewQuestionModel.title(data.question.title);
            viewQuestionModel.displayname(data.question.displayname);
            viewQuestionModel.description(data.question.description);
            viewQuestionModel.date(data.question.date);
            viewQuestionModel.answers(data.answers.rows);
        });
      },   
};
