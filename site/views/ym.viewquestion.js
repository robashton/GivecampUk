function ViewQuestionModel(id) {

    var $this = this;

    $this.template = 'viewquestion';
    $this.id = ko.observable(id || '');
    $this.title = ko.observable('');
    $this.description = ko.observable('');
    $this.displayname = ko.observable('');
    $this.tag = ko.observable('');
    $this.tagdescription = ko.observable('');
    $this.date = ko.observable('');
    $this.answers = ko.observableArray([]);
    $this.url = ko.observable('');

    $this.newAnswerForm = {
        answer: ko.observable(''),

        submit: function(event) {
            if ($('#newAnswerForm').valid()) {
                var form = $this.newAnswerForm;
                $.post('answer', {
                    question_id: $this.id(),
                    answer_text: form.answer()
                }).success(function(data) {
                        form.answer('');
                        $this.answers.push({ value: data });
                    });
            }
        }
    };

    $this.up = function(event, answer) {
        $.post('/increment_answer_rank', {
            answerId: answer._id
        }).success(function(data) {
                $(event.currentTarget).parent().children(':button').hide();
                $(event.currentTarget).parent().children().last().show();
                $this.pingItemInArray(answer);
            })
    };
    
    $this.down = function(event, answer) {

        $.post('/decrement_answer_rank', {
            answerId: answer._id
        }).success(function(data) {
                $(event.currentTarget).parent().children(':button').hide();
                $(event.currentTarget).parent().children().last().show();
                $this.pingItemInArray(answer);
            });
    };

    $this.pingItemInArray = function(answer) {
        /*      for(var i = viewQuestionModel.answers().length-1; i >= 0; i--){
         var item =  viewQuestionModel.answers()[i];
         if(item.value._id === answer._id){
         viewQuestionModel.answers.splice(i,1);
         viewQuestionModel.answers.push(item);
         }
         } */ // This would work if we had the ability to hide the buttons
    };

    $this.answersSortFunction = function(a, b) {
        return a.value.rank > b.value.rank ? -1 : 1;
    };

    $this.sortedAnswers = ko.dependentObservable(function() {
        return $this.answers.slice().sort($this.answersSortFunction);
    }, $this.answers);

    $.getJSON('/question/' + $this.id(), function(data) {
        if (data.error) console.log(data.error);
        $this.title(data.question.title);
        $this.displayname(data.question.displayname);
        $this.description(data.question.description);
        $this.tag(data.question.tag.tagName);
        $this.tagdescription(data.question.tag.description);
        $this.date(data.question.date);
        $this.answers(data.answers.rows);
    });
};