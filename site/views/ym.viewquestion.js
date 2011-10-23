var viewQuestionModel = {
      id: ko.observable(''),
      title: ko.observable(''),
      description: ko.observable(''),
      displayname: ko.observable(''),
      tag: ko.observable(''),
      tagdescription: ko.observable(''),
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
      
      up: function(event, answer) {
        $.post('/increment_answer_rank', {
            answerId: answer._id
        }).success(function(data) {
          $(event.currentTarget).parent().children(':button').hide();
          $(event.currentTarget).parent().children().last().show();
          viewQuestionModel.pingItemInArray(answer);
        })
      },
      down: function(event, answer) {
        
        $.post('/decrement_answer_rank', {
            answerId: answer._id
        }).success(function(data) {
            $(event.currentTarget).parent().children(':button').hide();
            $(event.currentTarget).parent().children().last().show();
            viewQuestionModel.pingItemInArray(answer);
        });
      },
      pingItemInArray: function(answer) {
    /*      for(var i = viewQuestionModel.answers().length-1; i >= 0; i--){ 
            var item =  viewQuestionModel.answers()[i];
            if(item.value._id === answer._id){              
                viewQuestionModel.answers.splice(i,1); 
                viewQuestionModel.answers.push(item);  
            }
        } */ // This would work if we had the ability to hide the buttons 
      },

      init: function() {
        $.getJSON('/question/' + viewQuestionModel.id(), function(data) {   
            if(data.error) console.log(data.error);         
            viewQuestionModel.title(data.question.title);
            viewQuestionModel.displayname(data.question.displayname);
            viewQuestionModel.description(data.question.description);
            viewQuestionModel.tag(data.question.tag.tagName);
            viewQuestionModel.tagdescription(data.question.tag.description);
            viewQuestionModel.date(data.question.date);
            viewQuestionModel.answers(data.answers.rows);
        });
      }
};

viewQuestionModel.answersSortFunction =  function(a, b) {
    return a.value.rank > b.value.rank ? -1 : 1;  
};

viewQuestionModel.sortedAnswers = ko.dependentObservable(function() {
  return viewQuestionModel.answers.slice().sort(viewQuestionModel.answersSortFunction);
}, viewQuestionModel.answers);

