/* global angular */

angular.module('flintAndSteel')
.controller('loginCtrl', [
		'$scope',
		'$state',
		'loginSvc',
		function($scope) {
			$scope.loginUser = function(account) {
				loginSvc.checkLogin(account, function LoginSuccess(data) {
					console.log(data);
				},
				function loginError(data, status, headers, config) {
					console.log(status);
				});
			};

			$scope.signUpUser = function signUpUser(account) {
				$state.go('signup', {account: account});
			};
		}
	]
);