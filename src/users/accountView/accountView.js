/* global angular */

angular.module('flintAndSteel')
.controller('AccountViewCtrl',
    [
        '$scope', '$state', 'toastSvc', 'userSvc', 'ideaSvc',
        function($scope, $state, toastSvc, userSvc, ideaSvc) {
            "use strict";

            // NOTE: Nothing can go above this!
            if (!userSvc.isUserLoggedIn()) {
                $state.go('home');
            }
            else {
                // Replace this with a DB read from logged in user
                $scope.user = {
                    username: userSvc.getProperty('username'),
                    password: userSvc.getProperty('password'),
                    name: userSvc.getProperty('name'),
                    email: userSvc.getProperty('email')
                };
            }

            ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                $scope.userIdeas = [];

                // Find all User Ideas
                for (var i = 0; i < data.length; i++) {  // was let
                    if (userSvc.isUserLoggedIn() && userSvc.getProperty('_id') === data[i].authorId) {
                        $scope.userIdeas.push(data[i]);
                    }
                }

            }, function getIdeaHeadersError(data, status) {
                console.log(status);
            });

            // /Replace
            $scope.logout = function logout() {
                var accountName = userSvc.getProperty('name');
                userSvc.logout();

                toastSvc.show(accountName + ' has been logged out!', { duration: 5000 });

                $state.go('home');
            };
        }
    ]
);
