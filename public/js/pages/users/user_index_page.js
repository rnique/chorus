(function($, ns) {
    ns.UserIndexPage = chorus.pages.Base.extend({
        crumbs : [
            { label: t("breadcrumbs.home"), url: "#/" },
            { label: t("breadcrumbs.users") }
        ],

        setup : function() {
            this.collection = new chorus.models.UserSet();
            this.collection.sortAsc("lastName");
            this.collection.fetch();
            this.mainContent = new chorus.views.MainContentList({
                modelClass : "User",
                collection : this.collection,
                linkMenus : {
                    sort : {
                        title : t("users.header.menu.sort.title"),
                        options : [
                            {data : "firstName", text : t("users.header.menu.sort.first_name")},
                            {data : "lastName", text : t("users.header.menu.sort.last_name")}
                        ],
                        event : "sort",
                        chosen : t("users.header.menu.sort.last_name")
                    }

                }
            })
            this.sidebar = new chorus.views.StaticTemplate("user_index_sidebar");

            this.mainContent.contentHeader.bind("choice:sort", function(choice) {
                this.collection.sortAsc(choice)
                this.collection.fetch();
            }, this)
        }
    });
})
    (jQuery, chorus.pages);
