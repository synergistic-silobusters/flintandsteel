/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('ideaInputView', function() {
    "use strict";

    var $rootScope, $q, scope, eventSvcMock, ctrl;

    beforeEach(module('flintAndSteel'));
    beforeEach(inject(function(_$rootScope_, _$q_, $controller, _eventSvcMock_) {
        $rootScope = _$rootScope_;
        $q = _$q_;
        scope = $rootScope.$new();
        eventSvcMock = _eventSvcMock_;

        ctrl = $controller('ideaInputView', {
            $scope: scope,
            eventSvc: eventSvcMock
        });
    }));

    describe('scope.loadEvents', function() {

        it('should populate the events', function() {
            scope.loadEvents();
            scope.$digest();

            expect(scope.events.length).not.toBe(0);
        });

        it('should append "none" to the list of events', function() {
            var numEvents;
            eventSvcMock.getEvents().then(function(response) {
                numEvents = response.data.length;
            });
            scope.loadEvents();
            scope.$digest();

            expect(scope.events.length).toBe(numEvents + 1); // appended "None"
        });

        it('should set events to an empty array if there was an error', function() {
            spyOn(eventSvcMock, 'getEvents').and.callFake(function() {
                return $q.reject('FAIL');
            });
            spyOn(console, 'log').and.callFake(function() {});

            scope.loadEvents();
            scope.$digest();

            expect(scope.events.length).toBe(0);
            expect(console.log).toHaveBeenCalledWith('FAIL');
        });
    });

    describe('tag related functions', function() {

        beforeEach(function() {
            scope.idea = {
                title: 'Test Title',
                eventId: 0,
                description: 'This is a test idea.',
                tags: ['TestTag1', 'TestTag2']
            };
        });

        describe('scope.tagKeyEvent', function() {
            var keyEvent, tagLength, expectLength;

            beforeEach(function() {
                scope.tagInput = 'a tag';
                keyEvent = {
                    keyCode: 13
                };
                tagLength = scope.idea.tags.length;
            });

            it('should call add Tag if enter is pushed', function() {
                expectLength = tagLength + 1;
                scope.tagKeyEvent(keyEvent);
                expect(scope.tagInput).toBe("");
                expect(scope.idea.tags.length).toBe(expectLength);
            });

            it('should not call add Tag if a key other than enter is pushed', function() {
                keyEvent.keyCode = 14;
                scope.tagKeyEvent(keyEvent);
                expect(scope.tagInput).toBe('a tag');
                expect(scope.idea.tags.length).toBe(tagLength);
            });
        });

        describe('scope.addTag', function() {

            it('should add tag', function() {
                scope.addTag('testTag3');

                expect(scope.idea.tags.length).not.toBe(2);
                expect(scope.idea.tags.length).toBe(3);
            });

            it('should not add duplicate tags', function() {
                scope.addTag('TestTag2');

                expect(scope.idea.tags.length).not.toBe(3);
                expect(scope.idea.tags.length).toBe(2);
            });

            it('should not add more than 5 tags', function() {
                scope.idea.tags = ['TestTag1', 'TestTag2', 'TestTag3', 'TestTag4', 'TestTag5'];

                scope.addTag('TestTag6');

                expect(scope.idea.tags.length).not.toBe(6);
                expect(scope.idea.tags.length).toBe(5);
            });

            it('should not add a blank tag', function() {
                scope.addTag('');

                expect(scope.idea.tags.length).not.toBe(3);
                expect(scope.idea.tags.length).toBe(2);
            });

            it('should remove special characters from tags', function() {
                scope.addTag('hello!@world&*@');

                expect(scope.idea.tags.length).toBe(3);
                expect(scope.doesTagExist('hello!@world&*@')).toBe(false);
                expect(scope.doesTagExist('HelloWorld')).toBe(true);
            });

            it('should use CamelCase for tags', function() {
                scope.addTag('This is a tag');

                expect(scope.idea.tags.length).toBe(3);
                expect(scope.doesTagExist('This is a tag')).toBe(false);
                expect(scope.doesTagExist('ThisIsATag')).toBe(true);
            });
        });

        describe('scope.deleteTag', function() {
            it('should delete tag if it exists', function() {
                scope.removeTag('TestTag2');

                expect(scope.idea.tags.length).not.toBe(2);
                expect(scope.idea.tags.length).toBe(1);
            });

            it('should not delete a non-existent tag', function() {
                scope.removeTag('TestTag3');

                expect(scope.idea.tags.length).not.toBe(1);
                expect(scope.idea.tags.length).toBe(2);
            });
        });
    });
});
