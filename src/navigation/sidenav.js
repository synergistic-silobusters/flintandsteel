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
			getIdeas = function() {
				ideaSvc.getIdeaHeaders(function getIdeaHeadersSuccess(data) {
					$scope.topIdeas = data;
				},function getIdeaHeadersError(data, status, headers, config) {
					console.log(status);
				});
			};

			var ideaAddEvents = new EventSource('/ideaheaders/events');
			ideaAddEvents.addEventListener("newHeaders", function(event) {
	      var headers = JSON.parse(event.data);
	      if(headers.length > 0) {
	        $scope.topIdeas = headers;
	      }
	    });

			getIdeas();
			//setInterval(getIdeas, 3000);


			$scope.navTo = function navTo(state) {
				if (state === 'addIdea') {
					if (loginSvc.isUserLoggedIn()) {
						$state.go(state);
					}
					else {
						$state.go('login');
					}
				}
				else if (state === 'idea') {
					$state.go('idea', {ideaId: 'mock_idea'});
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
