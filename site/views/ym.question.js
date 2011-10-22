var questionModel = {

    init: function() {
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
        return $('#askQuestion').valid();
}, questionModel);
