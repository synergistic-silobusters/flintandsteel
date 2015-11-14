/* global angular */

angular.module('flintAndSteel')
.controller('AccountViewCtrl', 
    [
        '$scope', '$state', '$mdToast', 'loginSvc',
        function($scope, $state, $mdToast, loginSvc) {
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
        }
    ]   
);
