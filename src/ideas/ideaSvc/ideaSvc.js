/* global angular */

angular.module('flintAndSteel')
.factory('ideaSvc',
    [
        '$http', 'userSvc', '$q',
        function($http, userSvc, $q) {
            "use strict";

            function getAuthorizationString() {
                return 'Bearer ' +
                    userSvc.getProperty('_id') + ':' +
                    userSvc.getProperty('token');
            }

            this.postIdea = function postIdea(idea) {
                return $http.post('/api/v1/ideas', idea, {
                    headers: {
                        'Authorization': getAuthorizationString()
                    }
                });
            };

            this.getIdea = function getIdea(ideaId) {
                return $http.get('/api/v1/ideas/' + ideaId);
            };

            this.getIdeaHeaders = function getIdeaHeaders() {
                return $http.get('/api/v1/ideas');
            };

            this.postComment = function postComment(parentId, text, authorId) {
                return $http.post('/api/v1/comments',
                    {
                        parentId: parentId,
                        text: text,
                        authorId: authorId
                    },
                    {
                        headers: {
                            'Authorization': getAuthorizationString()
                        }
                    }
                );
            };

            this.deleteComment = function deleteComment(commentId) {
                return $http.delete('/api/v1/comments/' + commentId, {
                    headers: {
                        'Authorization': getAuthorizationString()
                    }
                });
            };

            this.updateIdea = function updateIdea(ideaId, property, data) {
                if (ideaId !== 'mock_idea') {
                    return $http.patch('/api/v1/ideas/' + ideaId,
                        [
                            { operation: 'modify', path: property, value: JSON.stringify(data) }
                        ],
                        {
                            headers: {
                                'Authorization': getAuthorizationString()
                            }
                        }
                    );
                }
            };

            this.addInteraction = function addInteraction(ideaId, type, object) {
                if (ideaId !== 'mock_idea') {
                    return $http.patch('/api/v1/ideas/' + ideaId,
                        [
                            { operation: 'append', path: type, value: JSON.stringify(object) }
                        ],
                        {
                            headers: {
                                'Authorization': getAuthorizationString()
                            }
                        }
                    );
                }
            };

            this.removeInteraction = function removeInteraction(ideaId, type, object) {
                if (ideaId !== 'mock_idea') {
                    return $http.patch('/api/v1/ideas/' + ideaId,
                        [
                            { operation: 'delete', path: type + '/' + object._id }
                        ],
                        {
                            headers: {
                                'Authorization': getAuthorizationString()
                            }
                        }
                    );
                }
            };

            this.editBack = function editBack(ideaId, backId, newBack) {
                if (ideaId !== 'mock_idea') {
                    return $http.patch('/api/v1/ideas/' + ideaId,
                        [
                            { operation: 'modify', path: 'backs/' + backId, value: JSON.stringify(newBack) }
                        ],
                        {
                            headers: {
                                'Authorization': getAuthorizationString()
                            }
                        }
                    );
                }
            };

            this.editIdea = function editIdea(ideaId, title, description, tags, rolesreq, eventId) {
                if (ideaId !== 'mock_idea') {
                    return $http.patch('/api/v1/ideas/' + ideaId,
                        [
                            { operation: 'modify', path: 'title', value: JSON.stringify(title) },
                            { operation: 'modify', path: 'description', value: JSON.stringify(description) },
                            { operation: 'modify', path: 'tags', value: JSON.stringify(tags) },
                            { operation: 'modify', path: 'rolesreq', value: JSON.stringify(rolesreq) },
                            { operation: 'modify', path: 'eventId', value: JSON.stringify(eventId) }
                        ],
                        {
                            headers: {
                                'Authorization': getAuthorizationString()
                            }
                        }
                    );
                }
            };

            this.editIdeaRating = function editIdeaRating(ideaId, complexity) {
                if (ideaId !== 'mock_idea') {
                    return $http.patch('/api/v1/ideas/' + ideaId,
                        [
                            { operation: 'modify', path: 'complexity', value: JSON.stringify(complexity) }
                        ],
                        {
                            headers: {
                                'Authorization': getAuthorizationString()
                            }
                        }
                    );
                }
            };

            this.deleteIdea = function deleteIdea(ideaId) {
                if (ideaId !== 'mock_idea') {
                    return $http.delete('/api/v1/ideas/' + ideaId, {
                        headers: {
                            'Authorization': getAuthorizationString()
                        }
                    });
                }
            };

            this.getBackTypeChips = function getBackTypeChips() {
                var types = [
                    { name: 'Experience' },
                    { name: 'Funding' },
                    { name: 'Time' },
                    { name: 'Knowledge' },
                    { name: 'Social Network'},
                    { name: 'Materials' },
                    { name: 'How can I help?' }
                ];
                return types.map(function(type) {
                    //Lowercase '-' separated backing types for css classes
                    type._lowername = type.name.toLowerCase().replace(/[ ]/g, '-').replace('?', '');
                    return type;
                });
            };

            this.getUserIdeasById = function getUserIdeasById(userId) {
                if (userId) {
                    return $http.get('/api/v1/ideas/search?forterm=' + userId + '&inpath=authorId');
                }
                else {
                    return $q.reject('No userId supplied');
                }
            };

            this.getUserBacksById = function getUserBacksById(userId) {
                if (userId) {
                    return $http.get('/api/v1/ideas/search?forterm=' + userId + '&inpath=backs.authorId');
                }
                else {
                    return $q.reject('No userId supplied');
                }
            };

            return {
                postIdea: this.postIdea,
                getIdea: this.getIdea,
                getIdeaHeaders: this.getIdeaHeaders,
                postComment: this.postComment,
                deleteComment: this.deleteComment,
                updateIdea: this.updateIdea,
                addInteraction: this.addInteraction,
                removeInteraction: this.removeInteraction,
                editBack: this.editBack,
                editIdea: this.editIdea,
                deleteIdea: this.deleteIdea,
                getBackTypeChips: this.getBackTypeChips,
                editIdeaRating: this.editIdeaRating,
                getUserIdeasById: this.getUserIdeasById,
                getUserBacksById: this.getUserBacksById
            };
        }
    ]
);
