/* global angular */

angular.module('flintAndSteel')
.controller('AddIdeaViewCtrl', 
	[
		'$scope',
		'ideaSvc',
		function($scope, ideaSvc) {
			$scope.idea = {};

			$scope.addNewIdea = function addNewIdea(ideaToAdd) {
				console.log(ideaToAdd);
			}
		}
	]
);