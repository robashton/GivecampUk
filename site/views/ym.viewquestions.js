function ViewQuestionsModel(tag) {
    var $this = this;

    $this.template = 'questions';
    $this.questions = ko.observableArray();
    $this.tag_filter = ko.observable('');
    $this.tags = ko.observableArray();

    $this.tagSortFunction = function(a, b) {
        return a.value.count > b.value.count ? -1 : 1;
    };

    $this.questionSortFunction = function(a, b) {
        return new Date(a.value.question.date) > new Date(b.value.question.date) ? -1 : 1;
    };

    $this.chooseTag = function(key) {
        var key = key.replace(/\//g, '_z_').replace(/ /g, '_');
        $.routes('set', '/tag/' + key);
    };

    $this.updateSearch = function(key) {
        key = key.replace(/_z_/g, '/').replace(/_/g, ' ');
        var url = 'get_questions_by_tag/' + encodeURIComponent(key);
        $.get(url).success(function(data) {
            $this.tag_filter(key);

            var rows = data.doc.rows;
            $.each(rows, function(index, item) {
                item.value.answerCount = item.doc ? item.doc.count : 0;
            });
            $this.questions(rows);
        });
    };

    $this.sortedQuestions = ko.dependentObservable(function() {
        return $this.questions.slice().sort($this.questionSortFunction);
    }, $this.questions);

    $this.sortedTags = ko.dependentObservable(function() {
        return $this.tags.slice().sort($this.tagSortFunction);
    }, $this.tags);


    $.get('get_questions_by_tag/').success(function(data) {
        $this.questions(data.doc.rows);
    });

    $.get('get_popular_tags').success(function(data) {
        $this.tags(data.rows);
    });

    $this.updateSearch(tag || '');
};

