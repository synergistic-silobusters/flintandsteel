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

            $scope.userIdeas = [];

            ideaSvc.getIdeaHeaders().then(function getIdeaHeadersSuccess(response) {

                // Find all User Ideas
                if (userSvc.isUserLoggedIn()) {
                    var userId = userSvc.getProperty('_id');
                    $scope.userIdeas = response.data.filter(function(idea) {
                        return userId === idea.authorId;
                    });
                }

            }, function getIdeaHeadersError(response) {
                console.log(response);
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
