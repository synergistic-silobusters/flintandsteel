/* global angular */

angular.module('flintAndSteel')
.controller('SidenavCtrl',
    [
        '$scope', '$state', '$mdSidenav', 'ideaSvc', 'loginSvc', 'sseSvc',
        function($scope, $state, $mdSidenav, ideaSvc, loginSvc, sseSvc) {
            "use strict";

            function setIdeaHeaders(data) {
                $scope.$apply(function() {
                    $scope.topIdeas = data;
                });
            }

            function refreshHeaders() {
                ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                    $scope.topIdeas = data;
                }, function getIdeaHeadersError(data, status) {
                    console.log(status);
                });
            }

            refreshHeaders();

            sseSvc.create("newHeaders", "/ideaheaders/events", setIdeaHeaders);

            $scope.navTo = function navTo(state) {
                if (state === 'addIdea') {
                    if (loginSvc.isUserLoggedIn()) {
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

            $scope.isUserLoggedIn = loginSvc.isUserLoggedIn;

            $scope.$root.$on('newIdeaAdded', refreshHeaders);
        }
    ]
);
