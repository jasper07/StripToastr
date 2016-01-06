 sap.ui.require([
    "openui5/StripToastr",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
 ], function(StripToastr) {
    'use strict';
    QUnit.module("Basics", {
        teardown: function() {
            StripToastr.clear();
            sap.ui.getCore().applyChanges();
        }
    });

    QUnit.test('Rendered ', function(assert) {
        // Arrange
        var oToast = StripToastr.notify({
            text: "test1"
        });

        sap.ui.getCore().applyChanges();

        // Assert
        assert.ok(oToast, "created");
        assert.strictEqual(oToast.$().attr("role"), "alert", "The role is set");

    });

    QUnit.test("Newest first", function(assert) {
        // Arrange
        StripToastr._oSettings.newestFirst = true;

        // Act
        var aMessages = [
            StripToastr.notify({
                text: "test1"
            }), StripToastr.notify({
                text: "test2"
            }), StripToastr.notify({
                text: "test3"
            })
        ];

        sap.ui.getCore().applyChanges();

        // Assert
        var oContent = StripToastr.getContainer().getContent();
        assert.strictEqual(oContent[0].getText(), aMessages[2].getText(), "first is last");
        assert.strictEqual(oContent[2].getText(), aMessages[0].getText(), "last is first");
        StripToastr._oSettings.newestFirst = false;
    });

    QUnit.test("Close Callback", function(assert) {
        // Arrange
        var done = assert.async();
        var delay = 1000;
        var fnCloseCallBackSpy = this.spy();

        var oControl = StripToastr.notify({
            text: "test1",
            close: fnCloseCallBackSpy
        });

        // Act
        oControl.close();

        // Assert
        setTimeout(function() {
            assert.strictEqual(fnCloseCallBackSpy.callCount, 1, "Close Callback reached");
            done();
        }, delay);
    });

    QUnit.module("Clear", {
        teardown: function() {
            StripToastr.clear();
            sap.ui.getCore().applyChanges();
        }
    });

    QUnit.test('Clear empty container ', function(assert) {
        // Arrange
        var delay = 500;
        var done = assert.async();
        var oContainer = StripToastr.getContainer({
            position: "left bottom",
            anchor: document
        });
        sap.ui.getCore().applyChanges();
        assert.ok(oContainer.$(), "Container rendered");
        assert.strictEqual(oContainer.getContent().length, 0, "Container empty");

        // Act
        StripToastr.clear();
        // Assert
        setTimeout(function() {
            assert.strictEqual(oContainer.$().length, 0, "Container DOM was destroyed");
            done();
        }, delay);
    });

    QUnit.test('Clear all ', function(assert) {
        // Arrange
        var delay = 1000;
        var done = assert.async();

        StripToastr.notify({
            text: "test1"
        });
        StripToastr.notify({
            text: "test2"
        });
        StripToastr.notify({
            text: "test3"
        });

        sap.ui.getCore().applyChanges();
        // Act
        StripToastr.clear();
        // Assert
        setTimeout(function() {
            var oContainer = StripToastr.getContainer();
            assert.strictEqual(oContainer, undefined, "Container was destroyed");
            done();
        }, delay);

    });

    QUnit.test('Clear - 3 message remove 2nd only ', function(assert) {
        // Arrange
        var delay = 1000;
        var done = assert.async();

        var aMessages = [
            StripToastr.notify({
                text: "test1"
            }), StripToastr.notify({
                text: "test2"
            }), StripToastr.notify({
                text: "test3"
            })
        ];

        sap.ui.getCore().applyChanges();
        //Act
        StripToastr.clear(aMessages[1]);
        // Assert
        setTimeout(function() {
            var oContent = StripToastr.getContainer().getContent();
            assert.strictEqual(oContent.length, 2, "Container has 2 controls");
            assert.strictEqual(oContent[1].getText(), aMessages[2].getText(), "Container message 2 correct");
            done();
        }, delay);

    });

    QUnit.module("Positioning", {
        teardown: function() {
            StripToastr.destroyContainer();
            sap.ui.getCore().applyChanges();
        }
    });

    QUnit.test("Top right", function(assert) {
        // Arrange
        StripToastr.notify({
            text: "test1",
            position: "right top"
        });

        sap.ui.getCore().applyChanges();

        //Act
        var oContainer = StripToastr.getContainer();
        var oDomRef = oContainer.$();

        // Assert
        assert.strictEqual(oDomRef.css("right"), "0px", "Right 0px");
        assert.strictEqual(oDomRef.css("top"), "0px", "Top 0px");
    });

    QUnit.test("Top left", function(assert) {
        // Arrange
        StripToastr.notify({
            text: "test1",
            position: "left top"
        });

        sap.ui.getCore().applyChanges();

        //Act
        var oContainer = StripToastr.getContainer();
        var oDomRef = oContainer.$();

        // Assert
        assert.strictEqual(oDomRef.css("left"), "0px", "Left 0px");
        assert.strictEqual(oDomRef.css("top"), "0px", "Top 0px");
    });

    QUnit.test("Bottom right", function(assert) {
        // Arrange
        StripToastr.notify({
            text: "test1",
            position: "right bottom"
        });

        sap.ui.getCore().applyChanges();

        //Act
        var oContainer = StripToastr.getContainer();
        var oDomRef = oContainer.$();

        // Assert
        var iTop = (jQuery(window).height() - oDomRef.height());
        assert.strictEqual(oDomRef.css("right"), "0px", "Right 0px");
        assert.strictEqual(parseFloat(oDomRef.css("top")), iTop, "Top " + iTop + "px");
    });


    QUnit.test("Bottom left", function(assert) {
        // Arrange
        StripToastr.notify({
            text: "test1",
            position: "left bottom"
        });

        sap.ui.getCore().applyChanges();

        //Act
        var oContainer = StripToastr.getContainer();
        var oDomRef = oContainer.$();

        // Assert
        var iTop = (jQuery(window).height() - oDomRef.height());
        assert.strictEqual(oDomRef.css("left"), "0px", "Left 0px");
        assert.strictEqual(parseFloat(oDomRef.css("top")), iTop, "Top " + iTop + "px");
    });

    QUnit.test("Center center", function(assert) {
        // Arrange
        StripToastr.notify({
            text: "test1",
            position: "center center"
        });

        sap.ui.getCore().applyChanges();

        //Act
        var oContainer = StripToastr.getContainer();
        var oDomRef = oContainer.$();

        // Assert
        var iLeft = (jQuery(window).width() - oDomRef.width()) / 2;
        var iTop = (jQuery(window).height() - oDomRef.height()) / 2;
        assert.strictEqual(parseFloat(oDomRef.css("left")), iLeft, "Left " + iLeft + "px");
        assert.strictEqual(parseFloat(oDomRef.css("top")), iTop, "Top " + iTop + "px");
    });
 });
