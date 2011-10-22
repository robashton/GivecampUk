var tagadminModel = {
    init: function() {
        $.get('updateTags', function(data){
            if(!data.error){
                tagadminModel.tagList(data.tags);
            }
        });
    },
sortByName: function () {
        this.items.sort(function (a, b) {
            return a.tagName < b.tagName ? -1 : 1;
        })
},
  tagList: ko.observableArray()
};

tagadminModel.gridViewModel = new ko.simpleGrid.viewModel({
    data: tagadminModel.tagList,
    columns: [
        { headerText: "tagName", rowText: "Tag Name" },
        { headerText: "description", rowText: "Description" }
    ],
    pageSize: 10
});
 
ko.applyBindings(tagadminModel);
/*
loginModel.loginForm.valid = ko.dependentObservable(function(){
        return this.loginForm.email().length > 0 && this.loginForm.password().length > 0;
}, loginModel);*/
