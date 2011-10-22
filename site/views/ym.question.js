var questionModel = {

    init: function() {
        questionModel.title('');
        questionModel.description('');
        questionModel.tag(null);
        $.get('createquestion', function(data) {
            if (!data.error) {
                questionModel.tagList(data.tags);
            }
        });
    },

    title: ko.observable(''),
    description: ko.observable(''),
    tag: ko.observable(''),
    tagList: ko.observableArray([]),

    submit : function() {
        $.post('createquestion', {
            title: this().title(),
            description: this().description(),
            tag: this().tag()
        }).success(function(data) {
            $.routes('set', '/question/' + data.doc._id);
        })
    }
};

questionModel.valid = ko.dependentObservable(function(){
        return this.title().length > 0 && this.description().length > 0;
}, questionModel);
