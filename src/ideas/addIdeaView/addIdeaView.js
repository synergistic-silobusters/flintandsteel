/* global angular */

angular.module('flintAndSteel')
.controller('AddIdeaViewCtrl', 
	[
		'$scope',
		'$state',
		'$mdToast',
		'ideaSvc',
		function($scope, $state, $mdToast, ideaSvc) {
			$scope.idea = {};

			$scope.addNewIdea = function addNewIdea(ideaToAdd) {
				ideaToAdd.likes = [];
				ideaToAdd.comments = [];
				ideaToAdd.backs = [];
				ideaSvc.postIdea($scope.idea, function postIdeaSuccess(data) {
					console.log(data);
					if (data === 'Created') {
						$mdToast.show(
							$mdToast.simple()
								.content('New idea created successfully!')
								.position('top right')
								.hideDelay(3000)
						);
						$scope.$emit('newIdeaAdded');
						$state.go('home');
					}
				}, function(data, status, header, config) {
					console.log(status);
				});
			};
		}
	]
);