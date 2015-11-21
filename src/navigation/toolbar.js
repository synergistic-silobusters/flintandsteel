/* global angular */


// Dialog Controller used for controlling the behavior of the dialog
//   used for login.
function DialogController($scope, $mdDialog) {
    "use strict";

    $scope.hide = function() {
        $mdDialog.hide();
    };
    // what happens when you hit the cancel button
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    // what happens when you hit the login button
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

angular.module('flintAndSteel')
.controller('ToolbarCtrl',
    [
        '$scope', '$state', '$stateParams', '$mdSidenav', 'loginSvc', '$mdDialog', 'toastSvc',
        function($scope, $state, $stateParams, $mdSidenav, loginSvc, $mdDialog, toastSvc) {
            "use strict";

            $scope.displayOverflow = false;

            $scope.accountClick = function accountClick() {

                if (loginSvc.isUserLoggedIn()) {
                    $state.go('account');
                }
                else {
                    $state.go('home');
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
                    return loginSvc.getProperty('username');
                }
                return null;
            };

            //Login controller showing current login and logging in a new user
            $scope.showLogin = function(ev) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'users/loginView/loginView.tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function(answer) {
                    $scope.loginUser(answer);
                }, function() {
                    $scope.status = 'You canceled the dialog.';
                });
            };

            // Function used to display feedback on login - OK, Error, or User Not Found
            $scope.loginUser = function(account) {
                loginSvc.checkLogin(account, function LoginSuccess(data) {
                    var content;
                    if (data.status === 'AUTH_OK') {
                        $scope.currentUser = data.name;
                        content = data.name + ' has successfully signed in!';
                    }
                    else if (data.status === 'AUTH_ERROR') {
                        content = 'Your credentials don\'t match the stored ones :(';
                    }
                    else if (data.status === 'USER_NOT_FOUND') {
                        content = 'The user was not found in the server!';
                    }
                    toastSvc.show(content);
                },
                function loginError(data, status) {
                    console.log(status);
                });
            };

            // Logout from menu
            $scope.logout = function logout() {
                var accountName = loginSvc.getProperty('name');
                loginSvc.logout();
                toastSvc.show(accountName + ' has been logged out!');
                $state.go('home');
            };

            // Re-route to account page from menu
            $scope.settings = function settings() {
                $state.go('account');
            };
        }
    ]
);
