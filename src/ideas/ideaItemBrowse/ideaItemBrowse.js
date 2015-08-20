/* global angular */

angular.module('flintAndSteel')
.directive('ideaItemBrowse', 
	[
		function() {
			return {
				restrict: 'E',
				scope: {
					idea: '='
				},
				templateUrl: 'ideas/ideaItem/ideaItemBrowse.tpl.html'
			};
		}
	]
);