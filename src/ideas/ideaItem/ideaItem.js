/* global angular */

angular.module('flintAndSteel')
.directive('ideaItem', 
	[
		function() {
			return {
				restrict: 'E',
				scope: {
					idea: '='
				},
				templateUrl: 'ideas/ideaItem/ideaItem.tpl.html'
			};
		}
	]
);