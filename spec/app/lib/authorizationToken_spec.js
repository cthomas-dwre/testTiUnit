var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
describe('app/lib/authorizationToken.js', function() {
    var libUnderTest, httpClient;
    beforeAll(function() {
        var stub = {
            logging: sinon.stub().returns({
                info: sinon.stub(),
                trace: sinon.stub(),
                log: sinon.stub(),
                error: sinon.stub(),
                secureLog: sinon.stub()
            })
        };

        libUnderTest = proxyquire('../../../app/lib/authorizationToken.js', stub);

        httpClient = {
            open: sinon.stub(),
            setRequestHeader: sinon.stub(),
            setWithCredentials: sinon.stub(),
            responseText: '{"expires_in": 1}',
            access_token: 'some_token'
        };
    });
    describe('fetchToken onerror', function() {
        var promise;
        beforeAll(function() {
            var retval = _.extend(httpClient, {
                send: sinon.stub().callsFake(function() {
                    this.onerror();
                }),
                status: 200
            });
            Ti.Network.createHTTPClient = sinon.stub().returns(retval);
            promise = libUnderTest.fetchToken();
        })
        it('should have rejected promise', function() {
            expect(promise.state()).toEqual('rejected');
        });
    });

    describe('fetchToken onload bad status', function() {
        var promise;
        beforeAll(function() {
            var retval = _.extend(httpClient, {
                send: sinon.stub().callsFake(function() {
                    this.onload();
                }),
                status: 400
            });
            Ti.Network.createHTTPClient = sinon.stub().returns(retval);
            promise = libUnderTest.fetchToken();
        })
        it('should have rejected promise', function() {
            expect(promise.state()).toEqual('rejected');
        });
    });

    describe('fetchToken onload', function() {
        var promise;
        beforeAll(function() {
            var retval = _.extend(httpClient, {
                send: sinon.stub().callsFake(function() {
                    this.onload();
                }),
                status: 200
            });
            Ti.Network.createHTTPClient = sinon.stub().returns(retval);
            promise = libUnderTest.fetchToken();
        })
        it('should have resolved promise', function() {
            expect(promise.state()).toEqual('resolved');
        });
    });

})
