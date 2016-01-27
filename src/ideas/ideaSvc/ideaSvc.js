/* global angular */

angular.module('flintAndSteel')
.factory('ideaSvc',
    [
        '$http',
        function($http) {
            "use strict";

            this.postIdea = function postIdea(idea) {
                return $http.post('/api/v1/ideas', idea);
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
                    }
                );
            };

            this.deleteComment = function deleteComment(commentId) {
                return $http.delete('/api/v1/comments/' + commentId);
            };

            this.updateIdea = function updateIdea(ideaId, property, data) {
                if (ideaId !== 'mock_idea') {
                    return $http.patch('/api/v1/ideas/' + ideaId,
                        [
                            { operation: 'modify', path: property, value: JSON.stringify(data) }
                        ]
                    );
                }
            };

            this.addInteraction = function addInteraction(ideaId, type, object) {
                if (ideaId !== 'mock_idea') {
                    return $http.patch('/api/v1/ideas/' + ideaId,
                        [
                            { operation: 'append', path: type, value: JSON.stringify(object) }
                        ]
                    );
                }
            };

            this.removeInteraction = function removeInteraction(ideaId, type, object) {
                if (ideaId !== 'mock_idea') {
                    return $http.patch('/api/v1/ideas/' + ideaId,
                        [
                            { operation: 'delete', path: type + '/' + object._id }
                        ]
                    );
                }
            };

            this.editBack = function editBack(ideaId, backId, newBack) {
                if (ideaId !== 'mock_idea') {
                    return $http.patch('/api/v1/ideas/' + ideaId,
                        [
                            { operation: 'modify', path: 'backs/' + backId, value: JSON.stringify(newBack) }
                        ]
                    );
                }
            };

            this.editIdea = function editIdea(ideaId, title, description, tags, rolesreq) {
                if (ideaId !== 'mock_idea') {
                    return $http.patch('/api/v1/ideas/' + ideaId,
                        [
                            { operation: 'modify', path: 'title', value: JSON.stringify(title) },
                            { operation: 'modify', path: 'description', value: JSON.stringify(description) },
                            { operation: 'modify', path: 'tags', value: JSON.stringify(tags) },
                            { operation: 'modify', path: 'rolesreq', value: JSON.stringify(rolesreq) }
                        ]
                    );
                }
            };

            this.deleteIdea = function deleteIdea(ideaId) {
                if (ideaId !== 'mock_idea') {
                    return $http.delete('/api/v1/ideas/' + ideaId);
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
                getBackTypeChips: this.getBackTypeChips
            };
        }
    ]
);
