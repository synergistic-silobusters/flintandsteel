/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('eventSvc', function() {
    "use strict";

    var eventSvc, $httpBackend, dummyEvents;
    var now = new Date();

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function(_eventSvc_, _$httpBackend_) {
        eventSvc = _eventSvc_;
        $httpBackend = _$httpBackend_;
        dummyEvents = [
            {
                _id: 0,
                name: "The On-Going Event!",
                location: "Right Here",
                startDate: now,
                endDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
            },
            {
                _id: 1,
                name: "Expired Event",
                location: "Over There",
                startDate: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
                endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
            }
        ];
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should exist', function() {
        expect(eventSvc).toBeDefined();
    });

    describe('eventSvc.getEvents', function() {
        var getEventsHandler;

        beforeEach(function() {
            getEventsHandler = $httpBackend.whenGET('/events').respond(200, dummyEvents);
        });

        it('it should return all the events', function() {
            $httpBackend.expectGET('/events');

            eventSvc.getEvents().then(function() { }, function() { });

            $httpBackend.flush();
        });

    });
});
