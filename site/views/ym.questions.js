var questionsModel = {
    questions: ko.observableArray(),
    tags: ko.observableArray()
};

questionsModel.tagSortFunction =  function(a, b) {
    return a.value.count > b.value.count ? -1 : 1;  
};

questionsModel.updateSearch = function(key) {
     $.get('get_questions_by_tag/' + key).success(function(data) {
        questionsModel.questions(data.doc.rows);
    });
};


questionsModel.sortedTags = ko.dependentObservable(function() {
  return questionsModel.tags.slice().sort(questionsModel.tagSortFunction);
}, questionsModel.tags);

questionsModel.init = function() {

    $.get('get_questions_by_tag/').success(function(data) {
        questionsModel.questions(data.doc.rows);
    });

    $.get('get_popular_tags').success(function(data) {
        questionsModel.tags(data.rows);
    });
};
