/* global angular */

angular.module('flintAndSteel')
.controller('AddIdeaViewCtrl',
    [
        '$scope', '$state', 'toastSvc', 'ideaSvc', 'userSvc', '$window',
        function($scope, $state, toastSvc, ideaSvc, userSvc, $window) {
            "use strict";

            if (!userSvc.isUserLoggedIn()) {
                $state.go('home');
                toastSvc.show('You need to be logged into to create an idea!');
            }

            $scope.idea = {};
            $scope.idea.tags = [];
            $scope.idea.rolesreq = [];
            $scope.idea.eventId = "";

            ////////////////////
            // IDEA FUNCTIONS //
            ////////////////////

            $scope.addNewIdea = function addNewIdea(ideaToAdd) {
                ideaToAdd.authorId = userSvc.getProperty('_id');
                ideaSvc.postIdea($scope.idea).then(function postIdeaSuccess(response) {
                    if (angular.isDefined(response.data.status) && response.data.status === 'Created') {
                        $window.ga('send', {
                            hitType: 'event',
                            eventCategory: 'ideas',
                            eventAction: 'add'
                        });

                        toastSvc.show('New idea created successfully!');
                        $scope.$emit('newIdeaAdded');
                        $state.go('idea', { ideaId: response.data._id });
                    }
                }, function(response) {
                    console.log(response);
                });
            };
        }
    ]
);
