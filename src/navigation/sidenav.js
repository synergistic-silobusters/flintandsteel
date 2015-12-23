/* global angular */

angular.module('flintAndSteel')
.controller('SidenavCtrl',
    [
        '$scope', '$state', '$mdSidenav', 'ideaSvc', 'userSvc', 'sseSvc',
        function($scope, $state, $mdSidenav, ideaSvc, userSvc, sseSvc) {
            "use strict";

            function setIdeaHeaders(data) {
                $scope.$apply(function() {
                    $scope.topIdeas = data;
                });
            }

            function refreshHeaders() {
                ideaSvc.getIdeaHeaders().then(function getIdeaHeadersSuccess(response) {
                    $scope.topIdeas = response.data;
                }, function getIdeaHeadersError(response) {
                    console.log(response);
                });
            }

            refreshHeaders();

            sseSvc.create("newHeaders", "/sse/ideas", setIdeaHeaders);

            $scope.navTo = function navTo(state) {
                if (state === 'addIdea') {
                    if (userSvc.isUserLoggedIn()) {
                        $state.go(state);
                    }
                    else {
                        $state.go('home');
                    }
                }
                else if (state === 'idea') {
                    $state.go('idea', {ideaId: 'mock_idea'});
                }
                else {
                    $state.go(state);
                }
                if (!$mdSidenav('left').isLockedOpen()) {
                    $mdSidenav('left').close();
                }
            };

            $scope.isUserLoggedIn = userSvc.isUserLoggedIn;

            $scope.$root.$on('newIdeaAdded', refreshHeaders);
        }
    ]
);
