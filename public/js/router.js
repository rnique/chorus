(function($) {
    var chorus = window.chorus = window.chorus || {};

    var router = Backbone.Router.extend({
        routes: {
            "/dashboard"    :   "dashboard",
            "/login"        :   "login"
        },

        dashboard : function() {
            $("#content").html(new chorus.views.Dashboard().render().el);
        },

        login : function() {
            $("#content").html(new chorus.views.Login().render().el);
        }
    });

    window.chorus.router = new router();
})(jQuery);
