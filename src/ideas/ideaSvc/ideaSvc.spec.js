/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global moment */

describe('ideaSvc', function() {
    "use strict";

    var ideaSvc, $httpBackend, dummyIdea;

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function(_ideaSvc_, _$httpBackend_) {
        ideaSvc = _ideaSvc_;
        $httpBackend = _$httpBackend_;

        dummyIdea = {
            _id: 0,
            title: 'Test title',
            author: 'Guybrush Threepwood',
            description: 'Test description',
            likes: 45,
            comments: [
                {
                    text: 'Yeah, mhm.',
                    name: 'Dude',
                    time: moment().subtract(4, 'days').calendar()
                }
            ],
            backs: [
                {
                    text: 'Some resources',
                    name: 'Some Guy',
                    time: moment().calendar(),
                    types: [
                        { name: 'Experience' },
                        { name: 'Knowledge' }
                    ]
                }
            ]
        };
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should exist', function() {
        expect(ideaSvc).toBeDefined();
    });

    describe('ideaSvc.postIdea', function() {
        var postIdeaHandler;

        beforeEach(function() {
            postIdeaHandler = $httpBackend.whenPOST('/api/v1/ideas').respond(201, 'Created');
        });

        it('should add a newly submitted idea', function() {
            $httpBackend.expectPOST('/api/v1/ideas', dummyIdea);

            ideaSvc.postIdea(dummyIdea).then(function(response) {
                expect(response.data).toBe('Created');
            }, function() { });

            $httpBackend.flush();
        });
    });

    describe('ideaSvc.getIdea', function() {
        var getIdeaHandler;

        beforeEach(function() {
            getIdeaHandler = $httpBackend.whenGET('/api/v1/ideas/9001').respond(200, dummyIdea);
        });

        it('it should return an idea when provided an idea', function() {
            $httpBackend.expectGET('/api/v1/ideas/9001');

            ideaSvc.getIdea(9001).then(function() { }, function() { });

            $httpBackend.flush();
        });

    });

    describe('ideaSvc.getIdeaHeaders', function() {
        var getIdeaHeadersHandler, dummyHeaders;

        beforeEach(function() {
            dummyHeaders = [
                {
                    id: 'mock_idea',
                    name: 'The Bestest Idea Ever',
                    author: 'Yash Kulshrestha',
                    likes: 23
                }
            ];
            getIdeaHeadersHandler = $httpBackend.whenGET('/api/v1/ideas').respond(200, dummyHeaders);
        });

        it('should return idea headers', function() {
            $httpBackend.expectGET('/api/v1/ideas');

            ideaSvc.getIdeaHeaders().then(function() { }, function() { });

            $httpBackend.flush();
        });
    });

    describe('ideaSvc.updateIdea', function() {
        var updateIdeaHandler, patchOperation, ideaId;

        beforeEach(function() {
            ideaId = 'dummy_idea';
            patchOperation = [{
                operation: 'modify',
                path: 'likes',
                value: JSON.stringify(24)
            }];
            updateIdeaHandler = $httpBackend.whenPATCH('/api/v1/ideas/' + ideaId, patchOperation).respond(200, 'OK');
        });

        it('should update the idea with new passed in information', function() {
            $httpBackend.expectPATCH('/api/v1/ideas/' + ideaId, patchOperation);

            ideaSvc.updateIdea('dummy_idea', 'likes', 24).then(function() { }, function() { });

            $httpBackend.flush();
        });
    });

    describe('ideaSvc.getBackTypeChips', function() {
        var backTypes;

        it('should return the back types with lowercase property', function() {
            backTypes = ideaSvc.getBackTypeChips();

            expect(backTypes).toBeDefined();
            expect(backTypes[0].name).toBe('Experience');
            expect(backTypes[0]._lowername).toBe('experience');
        });
    });

    describe('ideaSvc.deleteIdea', function() {
        var ideaId, updateIdeaHandler;

        beforeEach(function() {
            ideaId = 'dummy_idea';
            updateIdeaHandler = $httpBackend.whenDELETE('/api/v1/ideas/' + ideaId).respond(204);
        });

        it('should delete the idea', function() {
            $httpBackend.expectDELETE('/api/v1/ideas/' + ideaId);

            ideaSvc.deleteIdea('dummy_idea', function() { }, function() { });

            $httpBackend.flush();
        });
    });

    describe('ideaSvc.postComment', function() {
        var postCommentHandler, dummyComment;

        beforeEach(function() {
            postCommentHandler = $httpBackend.whenPOST('/api/v1/comments').respond(201, 'Created');

            dummyComment = {
                parentId: dummyIdea._id,
                text: "This is a test comment",
                authorId: 1
            };
        });

        it('should add a newly submitted comment', function() {
            $httpBackend.expectPOST('/api/v1/comments', dummyComment);

            ideaSvc.postComment(dummyComment.parentId, dummyComment.text, dummyComment.authorId).then(function(response) {
                expect(response.data).toBe('Created');
            }, function() { });

            $httpBackend.flush();
        });
    });

    describe('ideaSvc.deleteComment', function() {
        var commentId, updateCommentHandler;

        beforeEach(function() {
            commentId = 'dummy_comment';
            updateCommentHandler = $httpBackend.whenDELETE('/api/v1/comments/' + commentId).respond(200, 'OK');
        });

        it('should delete the comment', function() {
            $httpBackend.expectDELETE('/api/v1/comments/' + commentId);

            ideaSvc.deleteComment(commentId).then(function() { }, function() { });

            $httpBackend.flush();
        });
    });

    describe('ideaSvc.addInteraction', function() {
        var addInteractionHandler, patchOperation, ideaId, valueObj;

        beforeEach(function() {
            addInteractionHandler = $httpBackend.whenPATCH('/api/v1/ideas/' + ideaId, patchOperation).respond(200, 'OK');

            ideaId = dummyIdea._id;
            valueObj = { userId: 1 };
            patchOperation = [{
                operation: 'append',
                path: 'likes',
                value: JSON.stringify(valueObj)
            }];
        });

        it('should add a new interaction', function() {
            $httpBackend.expectPATCH('/api/v1/ideas/' + ideaId, patchOperation).respond(200, 'OK');

            ideaSvc.addInteraction(ideaId, patchOperation[0].path, valueObj).then(function(response) {
                expect(response.data).toBe('OK');
            }, function() { });

            $httpBackend.flush();
        });
    });

    describe('ideaSvc.removeInteraction', function() {
        var removeInteractionHandler, patchOperation;

        beforeEach(function() {
            removeInteractionHandler = $httpBackend.whenPATCH('/api/v1/ideas/' + dummyIdea._id, patchOperation).respond(200, 'OK');

            patchOperation = [{
                operation: 'delete',
                path: 'likes/dummy_like'
            }];
        });

        it('should remove an existing interaction', function() {
            $httpBackend.expectPATCH('/api/v1/ideas/' + dummyIdea._id, patchOperation);

            ideaSvc.removeInteraction(dummyIdea._id, 'likes', { _id: 'dummy_like' }).then(function(response) {
                expect(response.data).toBe('OK');
            }, function() { });

            $httpBackend.flush();
        });
    });

    describe('ideaSvc.editBack', function() {
        var editBackHandler, dummyBack, patchOperation;

        beforeEach(function() {
            editBackHandler = $httpBackend.whenPATCH('/api/v1/ideas/' + dummyIdea._id, patchOperation).respond(200, 'OK');

            dummyBack = {
                _id: 'dummy_back',
                text: 'Just Experience',
                name: 'Some Guy',
                time: moment().calendar(),
                types: [
                    { name: 'Experience' }
                ]
            };

            patchOperation = [{
                operation: 'modify',
                path: 'backs/dummy_back',
                value: JSON.stringify(dummyBack)
            }];
        });

        it('should edit an existing back', function() {
            $httpBackend.expectPATCH('/api/v1/ideas/' + dummyIdea._id, patchOperation);

            ideaSvc.editBack(dummyIdea._id, dummyBack._id, dummyBack).then(function(response) {
                expect(response.data).toBe('OK');
            }, function() { });

            $httpBackend.flush();
        });
    });

    describe('ideaSvc.editIdea', function() {
        var editIdeaHandler, smallDummyIdea, patchOperation;

        beforeEach(function() {
            editIdeaHandler = $httpBackend.whenPATCH('/api/v1/ideas/' + dummyIdea._id, patchOperation).respond(200, 'OK');
            smallDummyIdea = {
                id: dummyIdea._id,
                title: dummyIdea.title,
                description: dummyIdea.description,
                tags: dummyIdea.tags,
                rolesreq: dummyIdea.rolesreq
            };

            patchOperation = [
                { operation: 'modify', path: 'title', value: JSON.stringify(smallDummyIdea.title) },
                { operation: 'modify', path: 'description', value: JSON.stringify(smallDummyIdea.description) },
                { operation: 'modify', path: 'tags', value: JSON.stringify(smallDummyIdea.tags) },
                { operation: 'modify', path: 'rolesreq', value: JSON.stringify(smallDummyIdea.rolesreq) }
            ];
        });

        it('should edit an existing idea', function() {
            $httpBackend.expectPATCH('/api/v1/ideas/' + dummyIdea._id, patchOperation);

            ideaSvc.editIdea(dummyIdea._id, dummyIdea.title, dummyIdea.description, dummyIdea.tags, dummyIdea.rolesreq).then(function(response) {
                expect(response.data).toBe('OK');
            }, function() { });

            $httpBackend.flush();
        });
    });

});
