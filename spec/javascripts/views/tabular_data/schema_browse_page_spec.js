describe("chorus.pages.SchemaBrowsePage", function() {
    beforeEach(function() {
        this.schema = fixtures.schema();
        this.instance = fixtures.instance({id: this.schema.get("instanceId")});
        this.page = new chorus.pages.SchemaBrowsePage(this.schema.get("instanceId"), this.schema.get("databaseName"), this.schema.get("name"));
    })

    it("has a helpId", function() {
        expect(this.page.helpId).toBe("schema")
    })

    describe("#initialize", function() {
        it("fetches the instance", function() {
            expect(this.server.lastFetchFor(this.instance)).not.toBeUndefined();
        });

        context("after the instance has been fetched", function() {
            beforeEach(function() {
                this.server.completeFetchFor(this.instance);
            });

            it("sets the instanceName on the schema", function() {
                expect(this.page.schema.get("instanceName")).toBe(this.instance.get("name"));
            });
        });

        context("after everything has been fetched", function() {
            beforeEach(function() {
                this.server.completeFetchFor(this.instance);
                this.page.render();
            });

            it("has the right breadcrumbs", function() {
                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(0).attr("href")).toBe("#/");
                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(0).text()).toBe(t("breadcrumbs.home"));

                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(1).attr("href")).toBe("#/instances");
                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(1).text()).toBe(t("breadcrumbs.instances"));

                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(2)).toHaveClass("dialog");
                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(2).data("dialog")).toBe("SchemaBrowser");
                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(2).data("instance")).toEqual({id: this.instance.get("id"), name: this.instance.get("name")});
                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(2).text()).toBe(this.page.schema.get("instanceName"));

                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(3)).toHaveClass("dialog");
                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(3).data("dialog")).toBe("SchemaBrowser");
                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(3).data("instance")).toEqual({id: this.instance.get("id"), name: this.instance.get("name")});
                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(3).data("databaseName")).toBe(this.page.schema.get("databaseName"));
                expect(this.page.$("#breadcrumbs .breadcrumb a").eq(3).text()).toBe(this.page.schema.get("databaseName"));

                expect(this.page.$("#breadcrumbs .breadcrumb .slug").text()).toBe(this.page.schema.get("name"));
            });

            it("has the right title", function() {
                expect(this.page.$(".content_header h1").text()).toBe(this.page.schema.canonicalName());
            });

            it("constructs the main content list correctly", function() {
                expect(this.page.mainContent).toBeA(chorus.views.MainContentList);
                expect(this.page.mainContent.collection).toBe(this.page.collection);
                expect(this.page.mainContent.collection).toBeA(chorus.collections.DatabaseObjectSet);

                expect(this.page.$(this.page.mainContent.el).length).toBe(1);
            });

            it("creates the collection with the right options", function() {
                expect(this.page.collection.attributes.instanceId).toBe(this.schema.get("instanceId"))
                expect(this.page.collection.attributes.databaseName).toBe(this.schema.get("databaseName"))
                expect(this.page.collection.attributes.schemaName).toBe(this.schema.get("name"))
            })

            context("with some items in the dataset", function() {
                beforeEach(function() {
                    this.page.collection.add(fixtures.databaseTable());
                    this.page.collection.add(fixtures.databaseView());
                    this.page.render();
                });

                it("pre-selects the first item", function() {
                    expect(this.page.$(".dataset_list li").eq(0)).toHaveClass("selected");
                });

                it("changes the selection after clicking another item", function() {
                    this.page.$(".dataset_list li").eq(1).click();

                    expect(this.page.$(".dataset_list li").eq(0)).not.toHaveClass("selected");
                    expect(this.page.$(".dataset_list li").eq(1)).toHaveClass("selected");
                });

            });
        });
    });
});
