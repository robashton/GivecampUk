function AskQuestionModel() {

    var $this = this;

    $this.template = 'question';
    $this.title = ko.observable('');
    $this.description = ko.observable('');
    $this.tag = ko.observable('');
    $this.tagList = ko.observableArray([]);

    $this.submit = function() {
        if ($('#askQuestion').valid()) {
            $.post('createquestion', {
                title: $this.title(),
                description: $this.description(),
                tag: $this.tag()
            }).success(function(data) {
                    $.routes('set', '/question/' + data.doc._id);
                })
        }
    };

    $this.valid = ko.dependentObservable(function() {
        return $this.title().length > 0 && $this.description().length > 0;
    }, $this);


    $.get('createquestion', function(data) {
        if (!data.error) {
            $this.tagList(data.tags);
        }
    });

};
