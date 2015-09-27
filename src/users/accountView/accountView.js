/* global angular */

angular.module('flintAndSteel')
.controller('AccountViewCtrl', 
    [
        '$scope', '$state', '$mdToast', 'loginSvc',
        function($scope, $state, $mdToast, loginSvc) {
            // NOTE: Nothing can go above this!
            if(!loginSvc.isUserLoggedIn()) {
                $state.go('home');
            }
            
            // Replace this with a DB read from logged in user
            $scope.user = {
                username: loginSvc.getProperty('username'),
                password: loginSvc.getProperty('password'),
                name: loginSvc.getProperty('name'),
                email: loginSvc.getProperty('email'),
             };
            // /Replace

            $scope.logout = function logout() {
                var accountName = loginSvc.getProperty('name');
                loginSvc.logout();
                $mdToast.show(
                    $mdToast.simple()
                        .content(accountName + ' has been logged out!')
                        .position('top right')
                        .hideDelay(5000)
                );
                $state.go('home');
            };   
        }
    ]   
);
