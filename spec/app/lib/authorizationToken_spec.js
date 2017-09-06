var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
describe('app/lib/authorizationToken.js', function() {

    var stub = {
        logging: sinon.stub().returns({
            info: sinon.stub(),
            trace: sinon.stub(),
            log: sinon.stub(),
            error: sinon.stub(),
            secureLog: sinon.stub()
        }),
        displaySiteDropDown: true,
    };

    var controllerUnderTest = proxyquire('../../../app/lib/authorizationToken.js', stub);

    var createHTTPClient = sinon.stub().returns({
        open: sinon.stub(),
        setRequestHeader: sinon.stub(),
        setWithCredentials: sinon.stub(),
        send: sinon.stub(),
        responseText: {},
        access_token: '11',
        status: 200,
    });

    describe('fetchToken', function() {
        beforeAll(function() {
            Ti.Network.createHTTPClient = createHTTPClient;
            controllerUnderTest.fetchToken();
        })
        it('should have called http.send', function() {
            expect(http.send.called).toEqual(true);
        });
    });

})
