/* global angular */

angular.module('flintAndSteel')
.factory('ideaSvc',
    [
        '$http',
        function($http) {

            this.postIdea = function postIdea(idea, successCb, errorCb){
                $http.get('/uniqueid?for=idea')
                    .success(function getIdSucess(data) {
                        idea.id = data;
                        $http.post('/idea', idea)
                            .success(successCb)
                            .error(errorCb);
                    })
                    .error(function getIdFailed(data, status, headers, config) {
                        console.log(status);
                    });
            };

            this.getIdea = function getIdea(ideaId, successCb, errorCb) {
                $http.get('/idea?id=' + ideaId)
                    .success(successCb)
                    .error(errorCb);
            };

            this.getIdeaHeaders = function getIdeaHeaders(successCb, errorCb) {
                $http.get('/ideaheaders')
                    .success(successCb)
                    .error(errorCb);
            };

            this.updateIdea = function updateIdea(ideaId, property, data, successCb, errorCb) {
                if (ideaId !== 'mock_idea') {
                    $http.post('/updateidea',
                            {
                                id: ideaId,
                                property: property,
                                value: data
                            }
                        )
                        .success(successCb)
                        .error(errorCb);
                }
            };

            this.deleteIdea = function deleteIdea(ideaId, successCb, errorCb) {
                if (ideaId !== 'mock_idea') {
                    $http.post('/deleteidea',
                            { id: ideaId }
                        )
                        .success(successCb)
                        .error(errorCb);
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
                return types.map(function (type) {
                    type._lowername = type.name.toLowerCase();
                    return type;
                });
            };

            return {
                postIdea: this.postIdea,
                getIdea: this.getIdea,
                getIdeaHeaders: this.getIdeaHeaders,
                getUniqueId: this.getUniqueId,
                updateIdea: this.updateIdea,
                deleteIdea: this.deleteIdea,
                getBackTypeChips: this.getBackTypeChips
            };
        }
    ]
);
