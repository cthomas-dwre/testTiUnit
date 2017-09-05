// ©2017 salesforce.com, inc. All rights reserved.
/**
 * models/globalPreferences.js - model definiton of global preferences
 *
 * @api public
 */

var logger = require('logging')('models:globalPreferences', 'app/models/globalPreferences');
var authorizationToken = require('authorizationToken');

exports.definition = {
    config : {
        model_name : 'globalPreferences',
        cache : false,
        useDataAPI : true,
        adapter : {
            type : 'ocapi'
        }
    },

    //**extendModel**
    extendModel : function(Model) {
        _.extend(Model.prototype, {
            //----------------------------------------
            // ## VARIABLES

            // TODO do we change /{instance_type} to staging, development, sandbox, production?
            url : '/global_preferences/preference_groups/eaGroup/production',
            ocapiVersion : 'v17_4',

            //----------------------------------------
            // ## FUNCTIONS

            /**
             * fetchPreferences - returns the global preferences from the server
             *
             * @param {String} storefrontHost
             * @return {Deferred} promise
             */
            fetchPreferences : function(storefrontHost) {
                var deferred = new _.Deferred();
                var self = this;

                authorizationToken.fetchToken().done(function() {
                    self.authorization = 'Bearer ' + authorizationToken.getToken();
                    self.fetch({
                        dontincludeid : true,
                        storefrontHost : storefrontHost
                    }).done(function() {
                        deferred.resolve();
                    }).fail(function(fault) {
                        var message = _L('Unable to load the configurations from the server.');
                        var type = 'UnknownException';
                        if (fault && fault.has('fault')) {
                            type = fault.get('fault').type;
                            switch(type) {
                            case 'CustomPreferenceGroupNotFoundException':
                                message = _L('Global preference group for Endless Aisle is not found.');
                                break;
                            case "ClientAccessForbiddenException":
                                message = _L("Unable to access global preference resource with OCAPI.");
                                break;
                            }
                        }
                        deferred.reject({
                            type : type,
                            message : fault.get('error') ? fault.get('error') : message
                        });
                    });
                }).fail(function(fault) {
                    var message = _L('Unable to obtain authorization token.');
                    var type = 'UnknownException';
                    if (fault && fault.has('fault')) {
                        type = fault.get('fault').type;
                    }
                    deferred.reject({
                        type : type,
                        message : message,
                        error : fault.get('error') ? fault.get('error') : message
                    });
                });
                return deferred.promise();
            },

            /**
             * getPreferences - get the global server preferences that were fetched
             * @return {String} Alloy.CFG additions
             */
            getPreferences : function() {
                var prefs;
                try {
                    prefs = JSON.parse(this.get('c_eaConfigurations'));
                } catch(ex) {
                    logger.error('exception parsing c_eaConfigurations from global preferences');
                }
                return prefs;
            }
        });

        return Model;
    }
};
