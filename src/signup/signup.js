/* global angular */

angular.module('flintAndSteel')
.controller('signupCtrl', 
	[
		'$scope',
		'$state',
		'$mdToast',
		'loginSvc',
		function($scope, $state, $mdToast, loginSvc) {

			$scope.account = {};
			$scope.account.username = $scope.$root.username;

			$scope.completeSignUp = function completeSignUp(account) {
				loginSvc.addUser(account, function addUserSuccess(data) {
					$mdToast.show(
						$mdToast.simple()
							.content('User creation successful, please log in.')
							.position('top right')
							.hideDelay(5000)
					);
					$state.go('login');
				},
				function addUserError(data, status, header, config) {
					console.log(status);
				});
			};
		}
	]
);