/* global angular */

angular.module('flintAndSteel')
.controller('ToolbarCtrl',
    [
        '$scope', '$state', '$stateParams', '$mdSidenav', 'loginSvc', '$mdDialog', '$mdToast',
        function($scope, $state, $stateParams, $mdSidenav, loginSvc, $mdDialog, $mdToast) {
            "use strict";
            
            $scope.displayOverflow = false;

            $scope.accountClick = function accountClick() {
                var returnState;

                if (loginSvc.isUserLoggedIn()) {
                    $state.go('account');
                }
                else {
                    returnState = $state.current.name +
                        $state.go('login', { 
                            'retState': $state.current.name, 
                            'retParams': $stateParams.ideaId
                        });
                }
            };

            $scope.stateIsHome = function checkState() {
                return $state.is('home');
            };

            $scope.showNav = function showNav() {
                $mdSidenav('left').toggle();
            };

            $scope.isUserLoggedIn = loginSvc.isUserLoggedIn;

            $scope.getUsername = function getUsername() {
                if ($scope.isUserLoggedIn()) {
                    $scope.username = loginSvc.getProperty('username');                    
                }
            };

            $scope.showLogin = function(ev) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'users/loginView/loginView.tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                })
                .then(function(answer) {
                    $scope.loginUser(answer);
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
           };         

           
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
        }
    ]
);

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.login = function(answer) {
        $mdDialog.hide($scope.loginUser(answer));
    };

    //pass the account object to the dialog window
    $scope.loginUser = function(account) {
        var status = {
            username: account.username, 
            password: account.password
        };
        return status;
   };
}
