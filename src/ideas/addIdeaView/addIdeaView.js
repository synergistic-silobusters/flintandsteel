/* global angular */

angular.module('flintAndSteel')
.controller('AddIdeaViewCtrl',
    [
        '$scope', '$state', 'toastSvc', 'ideaSvc', 'loginSvc',
        function($scope, $state, toastSvc, ideaSvc, loginSvc) {
            "use strict";

            if (!loginSvc.isUserLoggedIn()) {
                $state.go('home');
                toastSvc.show('You need to be logged into to create an idea!');
            }

            $scope.idea = {};

            $scope.addNewIdea = function addNewIdea(ideaToAdd) {
                ideaToAdd.authorId = loginSvc.getProperty('_id');
                ideaToAdd.eventId = "";
                ideaToAdd.tags = [];
                ideaToAdd.rolesreq = [];
                ideaSvc.postIdea($scope.idea, function postIdeaSuccess(data) {
                    if (angular.isDefined(data.status) && data.status === 'Created') {
                        toastSvc.show('New idea created successfully!');
                        $scope.$emit('newIdeaAdded');
                        $state.go('idea', { ideaId: data._id });
                    }
                }, function(data, status) {
                    console.log(status);
                });
            };
        }
    ]
);
