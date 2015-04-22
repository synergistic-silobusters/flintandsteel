/* global angular */

angular.module('flintAndSteel')
.controller('toolbarCtrl', 
	[
		'$scope',
		'$state',
		function($scope, $state) {
			$scope.accountClick = function() {
				$state.go('login');
			};
		}
	]
);