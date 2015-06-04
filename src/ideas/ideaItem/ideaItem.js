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
				templateUrl: 'ideaItem.tpl.html'
			};
		}
	]
);