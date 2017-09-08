// ©2017 salesforce.com, inc. All rights reserved.

var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('app/models/globalPreferences.js', function() {
    var stub, modelFileUnderTest, modelUnderTest;

    beforeAll(function() {
        stub = {
            logging: sinon.stub(),
            authorizationToken: {
                fetchToken: sinon.stub().usingPromise(new _.Deferred()).resolves(),
                getToken: sinon.stub().returns('token')
            }
        };

        modelFileUnderTest = proxyquire('../../../app/models/globalPreferences.js', stub);

        var GlobalPreferences = modelFileUnderTest.definition.extendModel(Backbone.Model.extend({
            fetch: sinon.stub().usingPromise(new _.Deferred()).resolves()
        }));

        modelUnderTest = new GlobalPreferences();
    });

    describe('model.fetchPreferences', function() {
        var returnedPromise;
        beforeAll(function() {
            returnedPromise = modelUnderTest.fetchPreferences();
        });

        it('should have called model.fetch', function() {
            expect(modelUnderTest.fetch.called).toEqual(true);
        });
        it('should have returned a resolved promise', function() {
            expect(returnedPromise.state()).toEqual('resolved');
        });
    });

    describe('model.fetchPreferences fail', function() {
        var returnedPromise;
        beforeAll(function() {
            modelUnderTest.fetch = sinon.stub().usingPromise(new _.Deferred()).rejects({
                has: sinon.stub().returns(true),
                get: sinon.stub().returns({
                    message: 'test',
                    type: 'error'
                })
            });
            returnedPromise = modelUnderTest.fetchPreferences();
        });

        it('should have called model.fetch', function() {
            expect(modelUnderTest.fetch.called).toEqual(true);
        });
        it('should have returned a rejected promise', function() {
            expect(returnedPromise.state()).toEqual('rejected');
        });
    });

    describe('model.fetchPreferences token fail', function() {
        var returnedPromise, modelUnderTest2;
        beforeAll(function() {
            var new_stub = _.extend(stub, {
                authorizationToken: {
                    fetchToken: sinon.stub().usingPromise(new _.Deferred()).rejects({
                        has: sinon.stub().returns(true),
                        get: sinon.stub().returns({
                            message: 'test',
                            type: 'error'
                        })
                    })
                }
            });
            var modelFileUnderTest2 = proxyquire('../../../app/models/globalPreferences.js', new_stub);
            var GlobalPreferences = modelFileUnderTest2.definition.extendModel(Backbone.Model.extend({
                fetch: sinon.stub().usingPromise(new _.Deferred()).resolves()
            }));

            modelUnderTest2 = new GlobalPreferences();
            returnedPromise = modelUnderTest2.fetchPreferences();
        });

        it('should have not called model.fetch', function() {
            expect(modelUnderTest2.fetch.called).toEqual(false);
        });
        it('should have returned a resolved promise', function() {
            expect(returnedPromise.state()).toEqual('rejected');
        });
    });

    describe('model.getPreferences', function() {
        beforeAll(function() {
            modelUnderTest.get = sinon.stub().returns('{"preference": 1}');
        });
        it('should have returned an object', function() {
            expect(_.isObject(modelUnderTest.getPreferences())).toEqual(true);
        });
    });

});
