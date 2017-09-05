// ©2017 salesforce.com, inc. All rights reserved.
/**
 * controllers/components/siteDropDown.js - Builds a view to display site dropdown
 */

//---------------------------------------------------
// ## VARIABLES

var appSettings = require('appSettings');
var logger = require('logging')('components:siteDropDown', getFullControllerPath($.__controllerPath));
var showActivityIndicator = require('dialogUtils').showActivityIndicator;
var loadConfigurations = require('appConfiguration').loadConfigurations;

//---------------------------------------------------
// ## PUBLIC API

exports.init = init;
exports.deinit = deinit;
exports.updateSiteSelectedItem = updateSiteSelectedItem;

//----------------------------------------------
// ## FUNCTIONS FOR VIEW/CONTROLLER LIFECYCLE

/**
 * INIT
 *
 * @api public
 */
function init() {
    logger.info('init called');
    initializeSites();
}

/**
 * DEINIT
 *
 * @api public
 */
function deinit() {
    logger.info('deinit called');
    removeAllChildren($.siteSelectionDropDown);
    $.stopListening();
    $.destroy();
}

//----------------------------------------------
// ## FUNCTIONS
/**
 * updateSiteSelectedItem - Used to select the item in the site dropdown
 * @param {Object} selectedItem
 *
 * @api public
 */
function updateSiteSelectedItem(selectedItem) {
    logger.info('updateCountrySelectedItem called');
    $.site_select.updateSelectedItem(selectedItem);
}

/**
 * initializeSites - create a view for site selector dropdown
 *
 * @api public
 */
function initializeSites() {
    logger.info('initializeSites called');
    var defaultSite;
    var sitesSupported = Alloy.CFG.sitesSupported;
    _.each(_.keys(sitesSupported), function(key) {
        var site = sitesSupported[key];
        site.localizedDisplayName = site.displayName;
        site.value = key;
        if (site.default) {
            defaultSite = site.value;
        }
    });
    $.site_select = Alloy.createController('components/selectWidget', {
        valueField : 'value',
        textField : 'localizedDisplayName',
        values : sitesSupported,
        messageWhenNoSelection : _L('Select Site'),
        selectListTitleStyle : {
            accessibilityValue : 'site_select_dropdown',
            width : Ti.UI.FILL,
            left : 10,
            color : Alloy.Styles.color.text.darkest,
            disabledColor : Alloy.Styles.color.text.light,
            disabledBackgroundColor : Alloy.Styles.color.background.light,
            font : Alloy.Styles.detailValueFont
        },
        selectListStyle : {
            width : Ti.UI.FILL,
            top : 0,
            color : Alloy.Styles.color.text.darkest,
            disabledColor : Alloy.Styles.color.text.light,
            disabledBackgroundColor : Alloy.Styles.color.background.light,
            font : Alloy.Styles.detailValueFont,
            selectedFont : Alloy.Styles.detailValueFont,
            unselectedFont : Alloy.Styles.detailValueFont,
        },
    });
    $.listenTo($.site_select, 'itemSelected', onSiteSelected);
    if (defaultSite) {
        $.site_select.updateSelectedItem(defaultSite);
    }
    $.siteSelectionDropDown.add($.site_select.getView());
}

//---------------------------------------------------
// ## UI EVENT HANDLER FUNCTIONS

/**
 * onSiteSelected - handle event when selected a value in country dropdown
 * @param {Object} event
 *
 * @api private
 */
function onSiteSelected(event) {
    if (Alloy.CFG.sitesSupported[event.item.value].storefront_host) {
        var storefrontHost = Alloy.CFG.sitesSupported[event.item.value].storefront_host;
        appSettings.setSetting('storefront_host', storefrontHost);
    } else {
        appSettings.setSetting('storefront_host', Alloy.CFG.default_storefront_host);
    }
    var promise = loadConfigurations(Alloy.CFG.storefront_host, event.item.value);
    showActivityIndicator(promise);
    promise.done(function() {
        appSettings.setSetting('siteSelected', event.item.value);
        $.trigger('site:change');
    }).fail(function(fault) {
        appSettings.setSetting('storefront_host', Alloy.CFG.default_storefront_host);
        Alloy.CFG.countryConfig = null;
        var message = _L('Unable to load application settings.');
        $.trigger('site:change', {
            error : true
        });
        if (fault) {
            message = fault.message;
        }
        Alloy.Dialog.showAlertDialog({
            messageString : message,
            titleString : _L('Configuration Error')
        });
    });
}

if(Alloy.UNIT_TEST){
    module.exports = {
        init: init,
        deinit: deinit,
        updateSiteSelectedItem: updateSiteSelectedItem,
        initializeSites: initializeSites,
        onSiteSelected: onSiteSelected
    }
}