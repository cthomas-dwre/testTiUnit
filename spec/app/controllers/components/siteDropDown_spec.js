// ©2017 salesforce.com, inc. All rights reserved.

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
describe('app/controllers/components/siteDropDown.js', function() {
    var stub, controllerUnderTest, createController, event;
    beforeAll(function() {
        stub = {
            appSettings: {
                setSetting: sinon.stub()
            },
            logging: sinon.stub().returns({
                info: sinon.stub()
            }),
            dialogUtils: {
                showActivityIndicator: sinon.stub()
            },
            appConfiguration: {
                loadConfigurations: function() {
                    var deferred = new _.Deferred();
                    deferred.resolve();
                    return deferred.promise();
                }
            }
        };

        createController = sinon.stub().returns({
            updateSelectedItem: sinon.stub(),
            getView: sinon.stub()
        });

        $ = require('tiunit/mockcontroller').createControllerMock('app/controllers/components/siteDropDown.js');

        $ = _.extend($, {
            '__controllerPath': 'path',
            stopListening: sinon.stub(),
            destroy: sinon.stub(),
            trigger: sinon.stub(),
            siteSelectionDropDown: {
                add: sinon.stub()
            }
        });

        Alloy.Styles = {
            appFont: {},
            color: {
                text: {
                    darkest: {},
                    light: {}
                },
                background: {
                    light: {}
                }
            }
        };
        Alloy.Dialog = Alloy.Dialog || {};
        Alloy.CFG = Alloy.CFG || {};
        Alloy.CFG.countryConfig = {};

        event = {
            item: {
                value: 'SiteGenesis'
            }
        };

        controllerUnderTest = proxyquire('../../../../app/controllers/components/siteDropDown.js', stub);
    });

    describe('init', function() {
        beforeAll(function() {
            Alloy.createController = createController;
            controllerUnderTest.init();
        });
        it('should have called $.siteSelectionDropDown.add', function() {
            // console.dir($);
            expect($.siteSelectionDropDown.add.called).toEqual(true);
        });
    });

    describe('initializeSites with default', function() {
        beforeAll(function() {
            Alloy.createController = createController;
            Alloy.CFG.sitesSupported = {
                SiteGenesis: {
                    displayName: 'United States',
                    default: true
                }
            };
            controllerUnderTest.initializeSites();
        });
        it('should have called $.siteSelectionDropDown.add', function() {
            // console.dir($);
            expect($.siteSelectionDropDown.add.called).toEqual(true);
        });
    });

    describe('deinit', function() {
        beforeAll(function() {
            removeAllChildren = sinon.stub();
            controllerUnderTest.deinit();
        });
        it('should have called $.destroy', function() {
            expect($.destroy.called).toEqual(true);
        });
    });

    describe('updateSiteSelectedItem', function() {
        beforeAll(function() {
            controllerUnderTest.updateSiteSelectedItem();
        });
        it('should have called $.site_select.updateSelectedItem', function() {
            expect($.site_select.updateSelectedItem.called).toEqual(true);
        });
    });

    describe('onSiteSelected', function() {
        beforeAll(function() {
            controllerUnderTest.onSiteSelected(event);
        });
        it('should have called $.trigger', function() {
            expect($.trigger.calledWith('site:change')).toEqual(true);
        });
    });

    describe('onSiteSelected failure', function() {
        beforeAll(function() {
            Alloy.Dialog = {
                showAlertDialog: sinon.stub()
            }
            var new_stub = _.extend(stub, {
                appConfiguration: {
                    loadConfigurations: function() {
                        var deferred = new _.Deferred();
                        deferred.reject({ message: 'something' });
                        return deferred.promise();
                    }
                }
            });
            var controllerUnderTest2 = proxyquire('../../../../app/controllers/components/siteDropDown.js', new_stub);

            controllerUnderTest2.onSiteSelected(event);
        });
        it('should have called showAlertDialog', function() {
            expect(Alloy.Dialog.showAlertDialog.called).toEqual(true);
        });
    });

    describe('onSiteSelected different host', function() {
        beforeAll(function() {
            Alloy.CFG.sitesSupported = {
                SiteGenesis: {
                    storefront_host: 'staging'
                }
            };
            controllerUnderTest.onSiteSelected(event);
        });
        it('should have called $.trigger', function() {
            expect($.trigger.called).toEqual(true);
        });
    });
})
