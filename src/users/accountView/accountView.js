/* global angular */

angular.module('flintAndSteel')
.controller('AccountViewCtrl',
    [
        '$scope', '$state', 'toastSvc', 'loginSvc', 'ideaSvc',
        function($scope, $state, toastSvc, loginSvc, ideaSvc) {
            "use strict";

            // NOTE: Nothing can go above this!
            if (!loginSvc.isUserLoggedIn()) {
                $state.go('home');
            }
            else {
                // Replace this with a DB read from logged in user
                $scope.user = {
                    username: loginSvc.getProperty('username'),
                    password: loginSvc.getProperty('password'),
                    name: loginSvc.getProperty('name'),
                    email: loginSvc.getProperty('email')
                };
            }

            ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
                $scope.userIdeas = [];

                // Find all User Ideas
                for (var i = 0; i < data.length; i++) {  // was let
                    if (loginSvc.isUserLoggedIn() && loginSvc.getProperty('_id') === data[i].authorId) {
                        $scope.userIdeas.push(data[i]);
                    }
                }

            }, function getIdeaHeadersError(data, status) {
                console.log(status);
            });

            // /Replace
            $scope.logout = function logout() {
                var accountName = loginSvc.getProperty('name');
                loginSvc.logout();

                toastSvc.show(accountName + ' has been logged out!', { duration: 5000 });

                $state.go('home');
            };
        }
    ]
);
