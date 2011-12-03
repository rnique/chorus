(function($, ns) {
    ns.UserShowPage = chorus.pages.Base.extend({
        crumbs : [
            { label: t("breadcrumbs.home"), url: "#/" },
            { label: t("breadcrumbs.users"), url: "#/users" },
            { label: t("breadcrumbs.user_profile") }
        ],

        setup : function(userId){
            var self = this;
            this.model = new chorus.models.User({id: userId});
            this.model.fetch();

            this.mainContent = new chorus.views.MainContentView({
                model : this.model,
                content : new chorus.views.UserShow({model : this.model}),
                contentHeader :  new chorus.views.StaticTemplate("default_content_header", function(){ return {title: self.model.displayName()}}),
                contentDetails : new chorus.views.StaticTemplate("plain_text", {text : t("users.details")})
            });

            this.sidebar = new chorus.views.UserShowSidebar({model: this.model})
        }

    });
})(jQuery, chorus.pages);
