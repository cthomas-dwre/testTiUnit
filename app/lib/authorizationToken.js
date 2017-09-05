// ©2017 salesforce.com, inc. All rights reserved.
/**
 * lib/authorizationToken.js - request to account manager to obtain authorization token for OCAPI
 */

//---------------------------------------------------
// ## VARIABLES

var logger = require('logging')('application:authorizationToken', 'app/lib/authorizationToken');
var accessRequestURL = 'http://account.demandware.com/dw/oauth2/access_token';
var token = null;

//---------------------------------------------------
// ## PUBLIC API

exports.fetchToken = fetchToken;
exports.resetToken = resetToken;
exports.getToken = getToken;

/**
 * fetchToken - fetch the account manager authorization token
 * @api public
 */
function fetchToken() {
    var deferred = new _.Deferred();
    var self = this;
    var now = new Date().getTime();
    // if the token should still be good, don't need to fetch it
    if (self.timeout && now < self.timeout) {
        deferred.resolve();
    } else {
        token = null;
        logger.info('fetching token');
        var http = Ti.Network.createHTTPClient({
            timeout : 30000,
            validatesSecureCertificate : true
        });
        logger.log('request', 'fetching token POST ' + accessRequestURL);
        http.open('POST', accessRequestURL);
        http.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        // base64 encoding of our client id:secret
        http.setRequestHeader('authorization', 'Basic YmZmNjllMTgtNThlZi00NGJkLWE4MDctZmIxODAxZjBmM2VmOnRlc3QxMjM0');
        http.setRequestHeader('cache-control', 'no-cache');
        http.setWithCredentials(true);

        http.onload = function() {
            logger.trace('fetchToken request complete http.status ' + http.status);
            if (http.responseText) {
                logger.secureLog('fetchToken response ' + JSON.stringify(http.responseText, null, 2), 'request-response');
            }
            if (http.status == 200) {
                try {
                    var response = JSON.parse(http.responseText);
                    token = response.access_token;
                    logger.secureLog('setting token ' + token);
                }
                catch(ex){
                    logger.error('parse exception');
                }
                var now = new Date().getTime();
                self.timeout = now + response.expires_in * 1000;
                deferred.resolve();
            } else {
                deferred.reject(http.responseText);
            }
        };
        http.onerror = function(eResp) {
            logger.error('fetchToken error!\n url: ' + accessRequestURL + '\n status: [' + http.status + ']\n response: [' + http.responseText + ']\n exception: [' + JSON.stringify(eResp, null, 2) + ']');
            deferred.reject(http.responseText);
        };

        logger.trace('fetchToken request');
        var data = 'grant_type=client_credentials';
        http.send(data);
    }
    return deferred.promise();
}

/**
 * resetToken - reset the authorization token
 * @api public
 */
function resetToken() {
    this.timeout = null;
}

/**
 * getToken - obtain the authorization token
 * @api public
 */
function getToken() {
    return token;
}
