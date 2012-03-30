chorus.views.SandboxNewStandaloneMode = chorus.views.Base.extend({
    className:"sandbox_new_standalone_mode",

    setup: function() {
        this.requiredResources.push(chorus.models.Config.instance());
    },

    additionalContext: function() {
        return { provisionMaxSizeInGB: chorus.models.Config.instance().get("provisionMaxSizeInGB") };
    },

    fieldValues:function () {
        return {
            instanceName:this.$("input[name='name']").val(),
            databaseName:this.$("input[name='databaseName']").val(),
            schemaName:this.$("input[name='schemaName']").val(),
            size:this.$("input[name='size']").val()
        }
    }
});