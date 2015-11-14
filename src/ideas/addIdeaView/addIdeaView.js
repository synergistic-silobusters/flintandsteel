/* global angular */

angular.module('flintAndSteel')
.controller('AddIdeaViewCtrl',
    [
        '$scope', '$state', 'toastSvc', 'ideaSvc', 'loginSvc',
        function($scope, $state, toastSvc, ideaSvc, loginSvc) {
            "use strict";

            if (!loginSvc.isUserLoggedIn()) {
                $state.go('home');
            }

            $scope.idea = {};

            $scope.addNewIdea = function addNewIdea(ideaToAdd) {
                ideaToAdd.author = loginSvc.getProperty('_id');
                ideaToAdd.likes = [];
                ideaToAdd.comments = [];
                ideaToAdd.backs = [];
                ideaSvc.postIdea($scope.idea, function postIdeaSuccess(data) {
                    console.log(data);
                    if (data === 'Created') {
                        toastSvc.show('New idea created successfully!');
                        $scope.$emit('newIdeaAdded');
                        $state.go('home');
                    }
                }, function(data, status) {
                    console.log(status);
                });
            };
        }
    ]
);
