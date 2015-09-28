/* global angular */

angular.module('flintAndSteel')
.controller('ToolbarCtrl',
    [
        '$scope', '$state', '$stateParams', '$mdSidenav', 'loginSvc',
        function($scope, $state, $stateParams, $mdSidenav, loginSvc) {
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
        }
    ]
);
