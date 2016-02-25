/* global angular */

angular.module('flintAndSteel')
.controller('LoginDialogCtrl',
    ['$scope', '$mdDialog',
        // Controls the behavior of the login dialog.
        function LoginDialogCtrl($scope, $mdDialog) {
            "use strict";

            // Cancel the login attempt, passing nothing back to parent controller
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            // Pass the credentials back to parent controller
            $scope.login = function(account) {
                $mdDialog.hide(account);
            };
        }
    ]
);
