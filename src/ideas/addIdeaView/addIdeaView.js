/* global angular */

angular.module('flintAndSteel')
.controller('AddIdeaViewCtrl',
    [
        '$scope', '$state', '$mdToast', 'ideaSvc', 'loginSvc',
        function($scope, $state, $mdToast, ideaSvc, loginSvc) {
            "use strict";

            if (!loginSvc.isUserLoggedIn()) {
                $state.go('home');
            }

            $scope.idea = {};

            $scope.addNewIdea = function addNewIdea(ideaToAdd) {
                ideaToAdd.authorId = loginSvc.getProperty('_id');
                ideaToAdd.eventId = "";
                ideaToAdd.tags = [];
                ideaToAdd.rolesreq = [];
                ideaSvc.postIdea($scope.idea, function postIdeaSuccess(data) {
                    if (angular.isDefined(data.status) && data.status === 'Created') {
                        $mdToast.show(
                            $mdToast.simple()
                                .content('New idea created successfully!')
                                .position('top right')
                                .hideDelay(3000)
                        );
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
