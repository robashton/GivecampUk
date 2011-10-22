var questionModel = {

    init: function() {
        
    },

    title: ko.observable(''),
    description: ko.observable(''),
    tag: ko.observable(''),
    tagList: ko.observableArray(),

    submit : function(){
        $.post('createquestion', {title: this().title(), description: this().description(), tag: this().tag() }).success(function(){alert('Thank you!')})
    }
}