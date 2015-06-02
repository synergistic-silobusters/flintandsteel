/* global angular */

angular.module('flintAndSteel')
.controller('SidenavCtrl',
	[
		'$scope',
		'$state',
		'$mdSidenav',
		'ideaSvc',
		'loginSvc',
		function($scope, $state, $mdSidenav, ideaSvc, loginSvc) {
			ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
				$scope.topIdeas = data;
			},function getIdeaHeadersError(data, status, headers, config) {
				console.log(status);
			});

			$scope.navTo = function navTo(state) {
				if (state === 'idea') {
					if (loginSvc.isUserLoggedIn()) {
						$state.go('idea', {ideaId: 'mock_idea'});
					}
					else {
						$state.go('login');
					}
				}
				else {
					$state.go(state);
				}
				if (!$mdSidenav('left').isLockedOpen()) {
					$mdSidenav('left').close();
				}
			};

			$scope.isUserLoggedIn = loginSvc.isUserLoggedIn;

			$scope.$root.$on('newIdeaAdded', function newIdeaAddedEvent(event) {
				ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
					$scope.topIdeas = data;
				},function getIdeaHeadersError(data, status, headers, config) {
					console.log(status);
				});
			});
		}
	]
);
