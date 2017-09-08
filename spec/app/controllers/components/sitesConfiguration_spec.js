// ©2017 salesforce.com, inc. All rights reserved.

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
describe('app/controllers/components/sitesConfiguration.js', function() {
    var controllerUnderTest;
    beforeAll(function() {
        var stub = {
            logging: sinon.stub().returns({
                info: sinon.stub()
            }),
            displaySiteDropDown: true
        };

        $ = require('tiunit/mockcontroller').createControllerMock('app/controllers/components/sitesConfiguration.js');

        $ = _.extend($, {
            '__controllerPath': 'path',
            stopListening: sinon.stub(),
            destroy: sinon.stub(),
            trigger: sinon.stub(),
            site_dropdown_view: {
                init: sinon.stub(),
                updateSiteSelectedItem: sinon.stub(),
                deinit: sinon.stub(),
            },
            language_dropdown_view: {
                init: sinon.stub(),
                deinit: sinon.stub(),
                enableOrDisableDropdown: sinon.stub(),
                updateLanguageSelectedItem: sinon.stub(),
                populateLanguages: sinon.stub()
            },
            country_dropdown_view: {
                init: sinon.stub(),
                deinit: sinon.stub(),
                initializeCountries: sinon.stub(),
                updateCountrySelectedItem: sinon.stub(),
                enableOrDisableDropdown: sinon.stub()
            },
            site_label: {
                hide: sinon.stub(),
                setText: sinon.stub(),
                setHeight: sinon.stub()
            },
            country_label: {
                setText: sinon.stub()
            },
            language_label: {
                setText: sinon.stub()
            },
            site_config: {
                setHeight: sinon.stub()
            }
        });
        // console.dir($);

        Alloy.CFG = Alloy.CFG || {};
        Alloy.CFG.countrySelected = {};
        Alloy.CFG.languageSelected = {};
        Alloy.CFG.siteSelected = {};

        controllerUnderTest = proxyquire('../../../../app/controllers/components/sitesConfiguration.js', stub);
    });

    describe('init with site', function() {
        beforeAll(function() {
            controllerUnderTest.init(true);
        })
        it('should have called $.language_dropdown_view.init', function() {
            expect($.language_dropdown_view.init.called).toEqual(true);
        });
    });

    describe('init no site', function() {
        beforeAll(function() {
            controllerUnderTest.init(false);
        })
        it('should have called $.language_dropdown_view.init', function() {
            expect($.language_dropdown_view.init.called).toEqual(true);
        });
    });

    describe('deinit', function() {
        beforeAll(function() {
            controllerUnderTest.deinit(true);
        })
        it('should have called $.destroy', function() {
            expect($.destroy.called).toEqual(true);
        });
    });

    describe('onSiteChange success', function() {
        beforeAll(function() {
            controllerUnderTest.onSiteChange(true);
        })
        it('should have called $.language_dropdown_view.enableOrDisableDropdown with true', function() {
            expect($.language_dropdown_view.enableOrDisableDropdown.calledWith(true)).toEqual(true);
        });
    });

    describe('onSiteChange failure', function() {
        beforeAll(function() {
            controllerUnderTest.onSiteChange(false);
        })
        it('should have called $.language_dropdown_view.enableOrDisableDropdown with false', function() {
            expect($.language_dropdown_view.enableOrDisableDropdown.calledWith(false)).toEqual(true);
        });
    });

    describe('onCountryChange', function() {
        beforeAll(function() {
            controllerUnderTest.onCountryChange();
        })
        it('should have called $.language_dropdown_view.populateLanguages', function() {
            expect($.language_dropdown_view.populateLanguages.called).toEqual(true);
        });
    });

    describe('onLanguageChange', function() {
        beforeAll(function() {
            controllerUnderTest.onLanguageChange();
        })
        it('should have called $.trigger', function() {
            expect($.trigger.called).toEqual(true);
        });
    });

    describe('updateSelectedItems with site', function() {
        beforeAll(function() {
            Alloy.CFG.siteSelected = {};
            controllerUnderTest.updateSelectedItems();
        })
        it('should have called $.site_dropdown_view.updateSiteSelectedItem', function() {
            expect($.site_dropdown_view.updateSiteSelectedItem.called).toEqual(true);
        });
    });

    describe('updateSelectedItems without site', function() {
        beforeAll(function() {
            displaySiteDropDown = false;
            controllerUnderTest.updateSelectedItems();
        })
        it('should have called $.site_dropdown_view.updateLanguageSelectedItem', function() {
            expect($.language_dropdown_view.updateLanguageSelectedItem.called).toEqual(true);
        });
    });

    describe('updateLabels', function() {
        beforeAll(function() {
            controllerUnderTest.updateLabels();
        })
        it('should have called $.country_dropdown_view.initializeCountries', function() {
            expect($.country_dropdown_view.initializeCountries.called).toEqual(true);
        });
    });

    describe('handleEmptyLanguageDropdown', function() {
        beforeAll(function() {
            controllerUnderTest.handleEmptyLanguageDropdown();
        })
        it('should have called $.trigger', function() {
            expect($.trigger.called).toEqual(true);
        });
    });
})
