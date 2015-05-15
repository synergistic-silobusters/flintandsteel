/* global angular */

angular.module('flintAndSteel')
.controller('AccountViewCtrl', 
	[
		'$scope',
		'$state',
		'$mdToast',
		'loginSvc',
		function($scope, $state, $mdToast, loginSvc) {
			if(!loginSvc.isUserLoggedIn()) {
				$state.go('home');
			}

			$scope.logout = function logout() {
				var accountName = loginSvc.getProperty('name');
				loginSvc.logout();
				$mdToast.show(
					$mdToast.simple()
						.content(accountName + ' has been logged out!')
						.position('top right')
						.hideDelay(5000)
				);
				$state.go('home');
			}
		}
	]
);