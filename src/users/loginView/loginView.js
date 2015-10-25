/* global angular */

angular.module('flintAndSteel')
.controller('LoginViewCtrl',
    [
        '$scope', '$state', '$stateParams', '$mdToast', 'loginSvc',
        function($scope, $state, $stateParams, $mdToast, loginSvc) {
            "use strict";

            $scope.loginUser = function(account) {
                loginSvc.checkLogin(account, function LoginSuccess(data) {
                    if (data.status === 'AUTH_OK') {
                        $mdToast.show(
                            $mdToast.simple()
                                .content(data.name + ' has successfully signed in!')
                                .action('OK')
                                .position('top right')
                                .hideDelay(3000)
                        );
                        var retState = $stateParams.retState;
                        if (typeof(retState) !== 'undefined' && retState !== '' && retState !== 'login') {
                            $state.go(retState, {'ideaId': $stateParams.retParams});
                        }
                        else {
                            $state.go('home');
                        }
                    }
                    else if (data.status === 'AUTH_ERROR') {
                        $mdToast.show(
                            $mdToast.simple()
                                .content('Your credentials don\'t match the stored ones :(')
                                .action('OK')
                                .position('top right')
                                .hideDelay(3000)
                        );
                    }
                    else if (data.status === 'USER_NOT_FOUND') {
                        $mdToast.show(
                            $mdToast.simple()
                                .content('The user was not found in the server!')
                                .action('OK')
                                .position('top right')
                                .hideDelay(3000)
                        );
                    }
                },
                function loginError(data, status) {
                    console.log(status);
                });
            };

            $scope.signUpUser = function signUpUser(account) {
                $scope.$root.username = account ? account.username : '';
                $state.go('signup');
            };
        }
    ]
);
