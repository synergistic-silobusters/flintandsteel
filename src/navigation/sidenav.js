/* global angular */
/* global EventSource */

angular.module('flintAndSteel')
.controller('SidenavCtrl',
    [
        '$scope', '$state', '$mdSidenav', 'ideaSvc', 'loginSvc',
        function($scope, $state, $mdSidenav, ideaSvc, loginSvc) {
            "use strict";

            ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                $scope.topIdeas = data;
            }, function getIdeaHeadersError(data, status) {
                console.log(status);
            });

            var ideaAddEvents = new EventSource('/ideaheaders/events');
            ideaAddEvents.addEventListener("newHeaders", function(event) {
                var headers = JSON.parse(event.data);
                if (headers.length > 0) {
                    $scope.$apply(function() {
                        $scope.topIdeas = headers;
                    });
                }
            });

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

            $scope.$root.$on('newIdeaAdded', function newIdeaAddedEvent() {
                ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                    $scope.topIdeas = data;
                },function getIdeaHeadersError(data, status) {
                    console.log(status);
                });
            });
        }
    ]
);
