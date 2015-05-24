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
					ideaSvc.updateIdea($scope.idea.id, type, $scope.idea[type],
					function success(data) {
						console.log(data);
					},
					function error(data, status, headers, config) {
						console.log(status);
					});
					document.getElementById('comment-box').value = '';
					document.getElementById('back-box').value = '';
					content = null;
				}
			};

			$scope.likeIdea = function likeIdea() {
				$scope.idea.likes++;
				ideaSvc.updateIdea($scope.idea.id, 'likes', $scope.idea.likes,
					function success(data) {
						console.log(data);
					},
					function error(data, status, headers, config) {
						console.log(status);
					});
				loginSvc.likeIdea($scope.idea.id);
			};

			$scope.unlikeIdea = function unlikeIdea() {
				$scope.idea.likes--;
				ideaSvc.updateIdea($scope.idea.id, 'likes', $scope.idea.likes,
					function success(data) {
						console.log(data);
					},
					function error(data, status, headers, config) {
						console.log(status);
					});
				loginSvc.unlikeIdea($scope.idea.id);
			};

			$scope.isUserLiked = function isUserLiked() {
				var likedIdeas = loginSvc.getProperty('likedIdeas');
				var result = (_.findIndex(likedIdeas, function(item) { return item === $scope.idea.id; }) !== -1);
				console.log(likedIdeas);
				console.log(result);
				return result;
			};

			$scope.isUserLoggedIn = loginSvc.isUserLoggedIn;
		}
	]
);