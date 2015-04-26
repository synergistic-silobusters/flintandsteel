/* global angular */

angular.module('flintAndSteel')
.controller('toolbarCtrl', 
	[
		'$scope',
		'$state',
		function($scope, $state) {
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
		}
	]
);