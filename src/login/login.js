/* global angular */

angular.module('flintAndSteel')
.controller('loginCtrl', [
		'$scope',
		function($scope) {
			$scope.loginUser = function(account) {
				console.log(account);
			};
		}
	]
);