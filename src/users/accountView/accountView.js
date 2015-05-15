/* global angular */

angular.module('flintAndSteel')
.controller('AccountViewCtrl', 
	[
		'$scope',
		'$state',
		'loginSvc',
		function($scope, $state, loginSvc) {
			if(!loginSvc.isUserLoggedIn()) {
				$state.go('home');
			}
		}
	]
);