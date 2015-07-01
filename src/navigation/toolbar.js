/* global angular */

angular.module('flintAndSteel')
.controller('ToolbarCtrl',
	[
		'$scope',
		'$state',
		'$stateParams',
		'$mdSidenav',
		'loginSvc',
		function($scope, $state, $stateParams, $mdSidenav, loginSvc) {
			$scope.displayOverflow = false;

			$scope.accountClick = function accountClick() {
				if (loginSvc.isUserLoggedIn()) {
					$state.go('account');
				}
				else {
					var returnState = $state.current.name +
					$state.go('login', {'retState':$state.current.name, 'retParams': $stateParams.ideaId});
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
