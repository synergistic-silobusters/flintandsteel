/* global angular */

angular.module('flintAndSteel')
.controller('LoginViewCtrl', [
		'$scope',
		'$state',
		'$mdToast',
		'loginSvc',
		function($scope, $state, $mdToast, loginSvc) {
			$scope.loginUser = function(account) {
				loginSvc.checkLogin(account, function LoginSuccess(data) {
					if (data === 'AUTH_OK') {
						$mdToast.show(
							$mdToast.simple()
								.content(account.username + ' has successfully signed in!')
								.position('top right')
								.hideDelay(5000)
						);
						$scope.$root.authenticated = true;
						$scope.$root.username = account.username;
						$state.go('home');
					}
					else if (data === 'AUTH_ERROR') {
						$mdToast.show(
							$mdToast.simple()
								.content('Your credentials don\'t match the stored ones :(')
								.position('top right')
								.hideDelay(5000)
						);
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