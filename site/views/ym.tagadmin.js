var tagadminModel = {
    init: function() {
        $.get('updateTags', function(data){
            if(!data.error){
                tagadminModel.tagList(data.tags);
            }
        });
    },
  tagList: ko.observableArray([]),

  remove: function(event) {
        var id = $(event.currentTarget).parent().siblings().first().text(); 
        $.post('removeTag', {  idtoremove: id}, refresh()); 
        
  },
Update: {
        tagName: ko.observable(''),
        description: ko.observable(''),
        add: function(event) {
            if($('#newTag').valid() ){
                var update = this().Update;
                this().tagList().push({tagName: update.tagName, description: update.description });
                $.post('updateTags', {  tagList: this().tagList()}, function() {
                  refresh();
                }); 
            }
        }
    },
 refresh: function(event){
          console.log("refresh");
           $.get('updateTags', function(data){
          console.log("got data");
          if(!data.error){
            console.log("not and error");
            tagadminModel.tagList(data.tags);
          }
        }
      
};
