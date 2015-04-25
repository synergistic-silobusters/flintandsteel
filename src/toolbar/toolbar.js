/* global angular */

angular.module('flintAndSteel')
.controller('toolbarCtrl', 
	[
		'$scope',
		'$state',
		function($scope, $state) {
			$scope.accountClick = function accountClick() {
				$state.go('login');
			};

			$scope.stateIsHome = function checkState() {
				return $state.is('home');
			};
		}
	]
);