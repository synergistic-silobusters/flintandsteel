/* global angular */

angular.module('flintAndSteel')
.controller('loginCtrl', [
		'$scope',
		'$state',
		'loginSvc',
		function($scope, $state, loginSvc) {
			$scope.loginUser = function(account) {
				loginSvc.checkLogin(account, function LoginSuccess(data) {
					if (data === 'AUTH_OK') {
						$scope.$root.authenticated = true;
						$state.go('home');
					}
					
				},
				function loginError(data, status, headers, config) {
					console.log(status);
				});
			};

			$scope.signUpUser = function signUpUser(account) {
				$scope.$root.username = account.username;
				$state.go('signup');
			};
		}
	]
);