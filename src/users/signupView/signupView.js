/* global angular */

angular.module('flintAndSteel')
.controller('SignupViewCtrl', 
    [
        '$scope', '$state', '$mdToast', 'loginSvc',
        function($scope, $state, $mdToast, loginSvc) {
            "use strict";

            $scope.account = {};
            $scope.duplicateUser = false;
            $scope.account.username = $scope.$root.username;

            $scope.completeSignUp = function completeSignUp(account) {
                loginSvc.addUser(account, function addUserSuccess() {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('User creation successful, please log in.')
                            .position('top right')
                            .hideDelay(3000)
                    );
                    $state.go('login');
                },
                function addUserError(data, status) {
                    console.log(status);
                });
            };

            $scope.$watch('account.username', function(newValue) {
                loginSvc.checkValidUsername(newValue, function(data) {
                    $scope.duplicateUser = !data;
                }, function(data, status) {
                    console.log(status);
                });
            });
        }
    ]
);