/* global angular */

angular.module('flintAndSteel')
.controller('ToolbarCtrl', 
	[
		'$scope',
		'$state',
		'$mdSidenav',
		function($scope, $state, $mdSidenav) {
			$scope.accountClick = function accountClick() {
				if ($scope.$root.authenticated) {
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