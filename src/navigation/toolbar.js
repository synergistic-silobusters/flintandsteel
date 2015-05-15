/* global angular */

angular.module('flintAndSteel')
.controller('ToolbarCtrl', 
	[
		'$scope',
		'$state',
		'$mdSidenav',
		'loginSvc',
		function($scope, $state, $mdSidenav, loginSvc) {
			$scope.accountClick = function accountClick() {
				if (loginSvc.isUserLoggedIn()) {
					$state.go('account');
				}
				else {
					$state.go('login');
				}
				
			};

			$scope.stateIsHome = function checkState() {
				return $state.is('home');
			};

			$scope.showNav = function showNav() {
				$mdSidenav('left').toggle();
			};
		}
	]
);