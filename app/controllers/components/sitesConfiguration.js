// ©2017 salesforce.com, inc. All rights reserved.
/**
 * controllers/components/sitesConfiguration.js - Builds a view to display country dropdown
 */

//---------------------------------------------------
// ## VARIABLES

var logger = require('logging')('components:sitesConfiguration', getFullControllerPath($.__controllerPath));
var displaySiteDropDown;
var selectedCountry;
var selectedLanguage;

//-----------------------------------------------------
// ## UI EVENT LISTENERS

// site dropdown change listener
$.listenTo($.site_dropdown_view, 'site:change', onSiteChange);

// country dropdown change listener
$.listenTo($.country_dropdown_view, 'country:change', onCountryChange);

// language dropdown change listener
$.listenTo($.language_dropdown_view, 'language:change', onLanguageChange);

// language dropdown noValues listener
$.listenTo($.language_dropdown_view, 'languageDropDown:next_button', handleEmptyLanguageDropdown);

//---------------------------------------------------
// ## PUBLIC API

exports.init = init;
exports.deinit = deinit;
exports.updateSelectedItems = updateSelectedItems;
exports.updateLabels = updateLabels;

//----------------------------------------------
// ## FUNCTIONS FOR VIEW/CONTROLLER LIFECYCLE

/**
 * INIT
 *
 * @api public
 */
function init(displaySite) {
    displaySiteDropDown = displaySite;
    selectedCountry = Alloy.CFG.countrySelected;
    selectedLanguage = Alloy.CFG.languageSelected;
    logger.info('init called');
    if (displaySiteDropDown) {
        $.site_dropdown_view.init();
        Alloy.CFG.siteSelected && $.site_dropdown_view.updateSiteSelectedItem(Alloy.CFG.siteSelected);
    } else {
        $.site_label.hide();
        $.site_label.setHeight(0);
        $.site_config.setHeight(0);
    }
    $.country_dropdown_view.init();
    $.language_dropdown_view.init();
}

/**
 * DEINIT
 *
 * @api public
 */
function deinit() {
    logger.info('deinit called');
    $.site_dropdown_view.deinit();
    $.country_dropdown_view.deinit();
    $.language_dropdown_view.deinit();
    $.stopListening();
    $.destroy();
}

//----------------------------------------------
// ## FUNCTIONS

/**
 * onSiteChange - gets called when the value in the site dropdown changes
 *
 * @api private
 */
function onSiteChange(failure) {
    if (!failure) {
        $.trigger('sitesConfiguration:next_button', {
            error : false
        });
        $.country_dropdown_view.initializeCountries();
        $.country_dropdown_view.enableOrDisableDropdown(false);
        $.language_dropdown_view.enableOrDisableDropdown(false);
    } else {
        $.trigger('sitesConfiguration:next_button', {
            error : true
        });
        $.country_dropdown_view.enableOrDisableDropdown(true);
        $.language_dropdown_view.enableOrDisableDropdown(true);
    }
}

/**
 * onCountryChange - gets called when the value in the country dropdown changes
 * @param {Object} tempCountrySelected
 *
 * @api private
 */
function onCountryChange(tempCountrySelected) {
    selectedCountry = tempCountrySelected;
    $.language_dropdown_view.populateLanguages(selectedCountry);
}

/**
 * onLanguageChange - gets called when the value in the language dropdown changes
 * @param {Object} tempLanguageSelected
 *
 * @api private
 */
function onLanguageChange(tempLanguageSelected) {
    selectedLanguage = tempLanguageSelected;
    $.trigger('sitesConfiguration:allDropDownSelected', {
        tempCountrySelected : selectedCountry,
        tempLanguageSelected : selectedLanguage
    });
}

/**
 * updateSelectedItems - this gets called to update the items in the dropdown
 *
 * @api public
 */
function updateSelectedItems() {
    if (displaySiteDropDown) {
        // We can only select the site as the country and language will then be filled and need to be selected later
        Alloy.CFG.siteSelected && $.site_dropdown_view.updateSiteSelectedItem(Alloy.CFG.siteSelected);
    } else {
        $.country_dropdown_view.initializeCountries();
        $.country_dropdown_view.updateCountrySelectedItem(selectedCountry);
        $.language_dropdown_view.updateLanguageSelectedItem(selectedLanguage);
    }
}

/**
 * updateLabels - update the labels when the language is changed
 */
function updateLabels() {
    $.site_label.setText(_L('Site: '));
    $.country_label.setText(_L('Country: '));
    $.language_label.setText(_L('Language: '));
    $.country_dropdown_view.initializeCountries(selectedCountry);
}

/**
 * handleEmptyLanguageDropdown - triggers an event to disable the next button 
 * when there is no languages supported.
 */
function handleEmptyLanguageDropdown() {
    $.trigger('sitesConfiguration:next_button', {
        error : true
    });
}

if(Alloy.UNIT_TEST){
    module.exports = {
        init: init,
        deinit: deinit,
        onSiteChange: onSiteChange,
        onCountryChange: onCountryChange,
        onLanguageChange: onLanguageChange,
        updateSelectedItems: updateSelectedItems,
        updateLabels: updateLabels,
        handleEmptyLanguageDropdown: handleEmptyLanguageDropdown
    }
}