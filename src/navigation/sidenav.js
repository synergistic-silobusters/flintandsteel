/* global angular */

angular.module('flintAndSteel')
.controller('SidenavCtrl', 
	[
		'$scope',
		'$state',
		'$mdSidenav',
		'ideaSvc',
		function($scope, $state, $mdSidenav, ideaSvc) {
			ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
				$scope.topIdeas = data;
			},function getIdeaHeadersError(data, status, headers, config) {
				console.log(status);
			});

			$scope.navTo = function navTo(state) {
				if (state === 'idea') {
					$state.go('idea', {ideaId: 'mock_idea'});
				}
				else {
					$state.go(state);
				}
				if (!$mdSidenav('left').isLockedOpen()) {
					$mdSidenav('left').close();
				}
			};

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