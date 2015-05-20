/* global angular */

angular.module('flintAndSteel')
.controller('IdeasViewCtrl', 
	[
		'$scope',
		'$stateParams',
		'ideaSvc',
		'loginSvc', 
		function($scope, $stateParams, ideaSvc, loginSvc){

			/*
			The way this works
				1) This view gets an ideaId from the $stateParams object, likely $stateParams.ideaId
				2) The controller then uses ideaSvc.getIdea() to fetch an idea from the server
				3) That idea is stored in $scope.idea
				4) Angular's two-way binding magic
				5) Profit
			 */

			$scope.debug = false;
			$scope.idea = {};

			ideaSvc.getIdea($stateParams.ideaId, function getIdeaSuccess(data) {
				$scope.idea = data;
			}, function getIdeaError(data, status, headers, config) {
				console.log(status);
			});

			$scope.addNewInteraction = function addNewInteraction(type, content) {
				if (type === 'comments' || type === 'backs') {
					$scope.idea[type].push({
						text: content,
						from: loginSvc.getProperty('name'),
						time: moment().calendar()
					});
					document.getElementById('comment-box').value = '';
					document.getElementById('back-box').value = '';
					content = null;
				}
			};
			$scope.isUserLoggedIn = loginSvc.isUserLoggedIn;
		}
	]
);