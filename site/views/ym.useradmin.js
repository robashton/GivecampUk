function useradminModel() {

    var $this = this;
    $this.template = 'useradmin';

    $this.refresh = function() {
        $.get('get_all_users', function(data) {

            if (!data.error) {

                var users = data.doc.rows;
                $.each(users, function(index, user) {
                    user.togglePermission = ko.observable(user.value.isElevated);
                    user.togglePermission.subscribe(function() {
                        if (user.togglePermission()) {
                            $.post('promote_user', { userId: user.value._id });
                        } else {
                            $.post('demote_user', { userId: user.value._id });
                        }
                    });


                });

                $this.users(users);
            }
        });
    };

    $this.users = ko.observableArray([]);

    $this.remove = function(event) {
        $.post('remove_user', { userId: event }, $this.refresh);
    };

    $this.refresh();
}
;
