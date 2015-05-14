/* global angular */

angular.module('flintAndSteel')
.controller('SidenavCtrl', 
	[
		'$scope',
		'$state',
		'$mdSidenav',
		'ideaSvc',
		function($scope, $state, $mdSidenav, ideaSvc) {
			$scope.navTo = function navTo(state) {
				$state.go(state);
				if (!$mdSidenav('left').isLockedOpen()) {
					$mdSidenav('left').close();
				}
			}
		}
	]
);