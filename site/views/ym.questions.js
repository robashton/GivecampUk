var questionsModel = {
    questions: ko.observableArray(),
    tag_filter: ko.observable(''),
    tags: ko.observableArray()
};

questionsModel.tagSortFunction =  function(a, b) {
    return a.value.count > b.value.count ? -1 : 1;  
};

questionsModel.chooseTag = function(key) {
  var key = key.replace(/\//g, '_z_').replace(/ /g, '_');
  $.routes('set', '/tag/' + key);
};

questionsModel.updateSearch = function(key) {
    key = key.replace(/_z_/g, '/').replace(/_/g, ' ');
    var url = 'get_questions_by_tag/' + encodeURIComponent(key);
     $.get(url).success(function(data) {
        questionsModel.tag_filter(key)
        questionsModel.questions(data.doc.rows);
    });
};

questionsModel.getAnswerCount = function(item) {
  if(!item || !item.count) return 0;
  return item.count;
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
