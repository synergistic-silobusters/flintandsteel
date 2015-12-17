/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('sseSvc', function() {
    "use strict";

    var sseSvc;

    var dummyObj = {};

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function(_sseSvc_) {
        sseSvc = _sseSvc_;

        dummyObj.spyCallback = function() {};

        spyOn(dummyObj, "spyCallback");
        spyOn(window, 'EventSource').and.callFake(function() {
            var obj = {};
            obj.addEventListener = function(name, cb) {
                cb({data: null});
            };
            obj.close = function() {
                obj.readyState = 2;
            };
            obj.readyState = 1;
            return obj;
        });
        // $httpBackend = _$httpBackend_;
    }));

    it('should exist', function() {
        expect(sseSvc).toBeDefined();
    });

    describe('create()', function() {
        it('should create an event listener and the callback should be called if the event is triggered', function() {
            sseSvc.create("test", "/test", dummyObj.spyCallback);
            expect(window.EventSource).toHaveBeenCalledWith("/test");
            expect(dummyObj.spyCallback).toHaveBeenCalledWith(null);
        });
    });

    describe('destroy()', function() {
        it('should close the event', function() {
            sseSvc.create("test", "/test", dummyObj.spyCallback);
            expect(function() {
                sseSvc.destroy();
            }).not.toThrowError(Error, "Could not close event!");
        });
    });

});
