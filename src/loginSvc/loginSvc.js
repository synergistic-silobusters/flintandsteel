/* global angular */

angular.module('flintAndSteel')
.factory('loginSvc', 
	[
		'$http',
		'appSettings',
		function($http, appSettings) {
			return {
				checkLogin: function checkLogin(account, successCb, errorCb){
					//console.log(account);
					$http.post(appSettings.serverUrl + '/login', account)
						.success(successCb)
						.error(errorCb);
				},
				addUser: function addUser(account, successCb, errorCb) {
					//console.log(account);
					$http.post(appSettings.serverUrl + '/signup', account)
						.success(successCb)
						.error(errorCb);
				}
			};
		}
	]
);