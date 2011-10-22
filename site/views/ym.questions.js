var questionsModel = {
    questions: ko.observableArray(),
    tags: ko.observableArray()
};

questionsModel.init = function() {

    $.get('get_questions_by_tag/').success(function(data) {

        if(!data.error) {
            questionsModel.questions(data.rows);
        }
    });

};