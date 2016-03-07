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

    var dummyObj = {},
        EventSourceMock = {};

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function(_sseSvc_) {
        sseSvc = _sseSvc_;

        dummyObj.spyCallback = function dummyCb() {};

        EventSourceMock.addEventListener = function(name, cb) {
            cb({data: null});
        };
        EventSourceMock.close = function successfulClose() {
            EventSourceMock.readyState = 2; // Closed
        };
        EventSourceMock.readyState = 1; // Open

        spyOn(EventSourceMock, 'close').and.callThrough();

        spyOn(window, 'EventSource').and.callFake(function() {
            return EventSourceMock;
        });
    }));

    it('should exist', function() {
        expect(sseSvc).toBeDefined();
    });

    describe('subscribe()', function() {
        it('should create an event listener', function() {
            sseSvc.subscribe("test", "/test", dummyObj.spyCallback);
            expect(window.EventSource).toHaveBeenCalledWith("/test");
        });

        it('should not create a duplicate listener', function() {
            sseSvc.subscribe("test", "/test", dummyObj.spyCallback);
            sseSvc.subscribe("test", "/test", dummyObj.spyCallback);
            expect(window.EventSource.calls.count()).toEqual(1);
        });
    });

    describe('unsubscribe()', function() {

        describe('when more than one subscriber', function() {
            it('should not attempt to close the event', function() {
                sseSvc.subscribe("test", "/test", dummyObj.spyCallback);
                sseSvc.subscribe("test", "/test", function anotherSubscriber() {});
                expect(function() {
                    sseSvc.unsubscribe("/test", dummyObj.spyCallback);
                }).not.toThrowError(Error, "Could not close event!");
                expect(EventSourceMock.close).not.toHaveBeenCalled();
            });
        });

        describe('when only one subscriber', function() {
            it('should successfully close the event if the server can be contacted', function() {
                sseSvc.subscribe("test", "/test", dummyObj.spyCallback);
                expect(function() {
                    sseSvc.unsubscribe("/test", dummyObj.spyCallback);
                }).not.toThrowError(Error, "Could not close event!");
                expect(EventSourceMock.close).toHaveBeenCalled();
            });

            it('should throw an error if the server is unavailable', function() {
                EventSourceMock.close = function badClose() {
                    EventSourceMock.readyState = 1;
                };

                sseSvc.subscribe("test", "/test", dummyObj.spyCallback);
                expect(function() {
                    sseSvc.unsubscribe("/test", dummyObj.spyCallback);
                }).toThrowError(Error, "Could not close event!");
            });
        });
    });

});
