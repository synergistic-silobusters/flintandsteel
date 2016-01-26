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

/* FROM addIdeaView Tests
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
*/

/* FROM IdeasViewCtrl Tests
it('should allow the author to add a tag', function() {
    scope.idea = {
        title: 'Test Title',
        authorId: 3,
        description: 'This is a test idea.',
        tags: ['TestTag1', 'TestTag2']
    };
    ctrl.addTag('TestTag3');

    expect(scope.idea.tags.length).not.toBe(2);
    expect(scope.idea.tags.length).toBe(3);
    scope.idea = {};
});

it('should allow the author to remove a tag', function() {
    scope.idea = {
        title: 'Test Title',
        authorId: 3,
        description: 'This is a test idea.',
        tags: ['TestTag1', 'TestTag2']
    };
    ctrl.removeTag('TestTag2');

    expect(scope.idea.tags.length).not.toBe(2);
    expect(scope.idea.tags.length).toBe(1);
    scope.idea = {};
});

it('should not add duplicate tags', function() {
    scope.idea = {
        title: 'Test Title',
        authorId: 3,
        description: 'This is a test idea.',
        tags: ['TestTag1', 'TestTag2']
    };
    ctrl.addTag('TestTag2');

    expect(scope.idea.tags.length).not.toBe(3);
    expect(scope.idea.tags.length).toBe(2);
    scope.idea = {};
});

it('should not add more than 5 tags', function() {
    scope.idea = {
        title: 'Test Title',
        authorId: 3,
        description: 'This is a test idea.',
        tags: ['TestTag1', 'TestTag2', 'TestTag3', 'TestTag4', 'TestTag5']
    };
    ctrl.addTag('TestTag6');

    expect(scope.idea.tags.length).not.toBe(6);
    expect(scope.idea.tags.length).toBe(5);
    scope.idea = {};
});

it('should not add a blank tag', function() {
    scope.idea = {
        title: 'Test Title',
        authorId: 3,
        description: 'This is a test idea.',
        tags: ['TestTag1', 'TestTag2']
    };
    ctrl.addTag('');

    expect(scope.idea.tags.length).not.toBe(3);
    expect(scope.idea.tags.length).toBe(2);
});

it('should remove special characters from tags', function() {
    scope.idea = {
        title: 'Test Title',
        authorId: 3,
        description: 'This is a test idea.',
        tags: ['TestTag1', 'TestTag2']
    };
    ctrl.addTag('hello!@world&*@');

    expect(scope.idea.tags.length).toBe(3);
    expect(ctrl.doesTagExist('hello!@world&*@')).toBe(false);
    expect(ctrl.doesTagExist('HelloWorld')).toBe(true);
});

it('should use CamelCase for tags', function() {
    scope.idea = {
        title: 'Test Title',
        authorId: 3,
        description: 'This is a test idea.',
        tags: ['TestTag1', 'TestTag2']
    };
    ctrl.addTag('This is a tag');

    expect(scope.idea.tags.length).toBe(3);
    expect(ctrl.doesTagExist('This is a tag')).toBe(false);
    expect(ctrl.doesTagExist('ThisIsATag')).toBe(true);
});

describe('ctrl.doesTagExist', function() {
    var mockIdea;

    beforeEach(function() {
        mockIdea = ideaSvcMock.getIdea();
        scope.idea = mockIdea.$$state.value.data;
    });

    it('should return true if tag exists', function() {
        expect(ctrl.doesTagExist(scope.idea.tags[0])).toBe(true);
    });

    it('should return false if tag does not exist', function() {
        expect(ctrl.doesTagExist('noneOfTheTags')).toBe(false);
    });
});

describe('ctrl.addTag', function() {
    var tagLength, expectLength, mockIdea;

    beforeEach(function() {
        mockIdea = ideaSvcMock.getIdea();
        scope.idea = mockIdea.$$state.value.data;
        tagLength = scope.idea.tags.length;
    });

    it('should increase the tag size if tag does not exist', function() {
        expectLength = tagLength + 1;
        ctrl.addTag('this is a new tag');
        expect(scope.idea.tags.length).toBe(expectLength);
    });

    it('should not increase the tag size if tag does exist', function() {
        expectLength = tagLength + 1;
        ctrl.addTag('1');
        expect(scope.idea.tags.length).toBe(expectLength);
        ctrl.addTag('1');
        expect(scope.idea.tags.length).toBe(expectLength);
    });

    it('should not increase the tag size if there are already 5 tags', function() {
        ctrl.addTag('3');
        ctrl.addTag('4');
        ctrl.addTag('5');
        expect(scope.idea.tags.length).toBe(5);
        ctrl.addTag('6');
        expect(scope.idea.tags.length).toBe(5);
    });

    it('should not increase the tag size if tag is empty', function() {
        ctrl.addTag('');
        expect(scope.idea.tags.length).toBe(tagLength);
    });
});

describe('ctrl.tagKeyEvent', function() {
    var keyEvent, tagLength, expectLength, mockIdea;

    beforeEach(function() {
        mockIdea = ideaSvcMock.getIdea();
        scope.idea = mockIdea.$$state.value.data;
        ctrl.tagInput = 'a tag';
        keyEvent = {
            keyCode: 13
        };
        tagLength = scope.idea.tags.length;
    });

    it('should call add Tag if enter is pushed', function() {
        expectLength = tagLength + 1;
        ctrl.tagKeyEvent(keyEvent);
        expect(ctrl.tagInput).toBe("");
        expect(scope.idea.tags.length).toBe(expectLength);
    });

    it('should not call add Tag if a key other than enter is pushed', function() {
        keyEvent.keyCode = 14;
        ctrl.tagKeyEvent(keyEvent);
        expect(ctrl.tagInput).toBe('a tag');
        expect(scope.idea.tags.length).toBe(tagLength);
    });
});

describe('ctrl.removeTag', function() {
    var tagLength, expectLength, mockIdea;

    beforeEach(function() {
        mockIdea = ideaSvcMock.getIdea();
        scope.idea = mockIdea.$$state.value.data;
        tagLength = scope.idea.tags.length;
    });

    it('should remove a tag if the tag exists', function() {
        expectLength = tagLength - 1;
        ctrl.removeTag('thisIsATag');
        expect(scope.idea.tags.length).toBe(expectLength);
    });

    it('should not remove a tag if the tag does not exist', function() {
        ctrl.removeTag('thisIsNotATag');
        expect(scope.idea.tags.length).toBe(tagLength);
    });
});
*/
