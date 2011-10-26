function TagAdminModel() {

    var $this = this;
    $this.template = 'tagadmin';

    $this.tagList = ko.observableArray([]);

    $this.remove = function(event) {
        var id = $(event.currentTarget).parent().siblings().first().text();
        $.post('removeTag', {  idtoremove: id}, $this.refresh);

    };

    $this.update = {
        tagName: ko.observable(''),
        description: ko.observable(''),
        add: function(event) {
            if ($('#newTag').valid()) {
                var update = $this.update;
                $this.tagList().push({tagName: update.tagName, description: update.description });
                $.post('updateTags', {  tagList: $this.tagList()}, $this.refresh);
            }
        }
    };

    $this.refresh = function() {
        $.get('updateTags', function(data) {
            if (!data.error) {
                $this.tagList(data.tags);
            }
        });
    };

    $.get('updateTags', function(data) {
        if (!data.error) {
            $this.tagList(data.tags);
        }
    });
};
