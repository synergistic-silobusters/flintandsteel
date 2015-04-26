/* global angular */

angular.module('flintAndSteel')
.controller('signupCtrl', 
	[
		'$scope',
		'$state',
		'loginSvc',
		function($scope, $state, loginSvc) {

			$scope.account = {};
			$scope.account.username = $scope.$root.username;

			$scope.completeSignUp = function completeSignUp(account) {
				loginSvc.addUser(account, function addUserSuccess(data) {
					$state.go('login');
				},
				function addUserError(data, status, header, config) {
					console.log(status);
				});
			};
		}
	]
);