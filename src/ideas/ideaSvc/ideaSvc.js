/* global angular */

angular.module('flintAndSteel')
.factory('ideaSvc', 
	[
		'$http',
		'appSettings',
		function($http, appSettings) {

			return {
				postIdea: function postIdea(idea, successCb, errorCb){
					//console.log(account);
					idea.id = _.uniqueId('idea_');
					$http.post(appSettings.serverUrl + '/idea', idea)
						.success(successCb)
						.error(errorCb);
				},
				getIdea: function getIdea(ideaId, successCb, errorCb) {
					//console.log(account);
					$http.post(appSettings.serverUrl + '/idea?id=' + ideaId, account)
						.success(successCb)
						.error(errorCb);
				},
				getIdeaHeaders: function getIdeaHeaders(successCb, errorCb) {
					$http.get(appSettings.serverUrl + '/ideaheaders')
						.success(successCb)
						.error(errorCb);
				}
			};
		}
	]
);