/* global angular */

angular.module('flintAndSteel')
.controller('AccountViewCtrl',
    [
        '$scope', '$state', 'toastSvc', 'loginSvc',
        function($scope, $state, toastSvc, loginSvc) {
            "use strict";

            // NOTE: Nothing can go above this!
            if (!loginSvc.isUserLoggedIn()) {
                $state.go('home');
            }

            // Replace this with a DB read from logged in user
            $scope.user = {
                username: loginSvc.getProperty('username'),
                password: loginSvc.getProperty('password'),
                name: loginSvc.getProperty('name'),
                email: loginSvc.getProperty('email')
            };
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
