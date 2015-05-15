/* global angular */

angular.module('flintAndSteel')
.factory('loginSvc', 
	[
		'$http',
		'$rootScope',
		'appSettings',
		function($http, $rootScope, appSettings) {

			return {
				checkLogin: function checkLogin(account, successCb, errorCb){
					//console.log(account);
					$http.post('/login', account)
						.success(function(data, status, headers, config) {
							$rootScope.account = data;
							successCb(data, status, headers, config);
						})
						.error(errorCb);
				},
				addUser: function addUser(account, successCb, errorCb) {
					//console.log(account);
					account.id = _.uniqueId('user_');
					$http.post('/signup', account)
						.success(successCb)
						.error(errorCb);
				},
				isUserLoggedIn: function isUserLoggedIn() {
					if (typeof $rootScope.account === 'undefined') {
						return false;
					}
					return $rootScope.account.status === 'AUTH_OK';
				},
				logout: function logout() {
					$rootScope.account = undefined;
				},
				getProperty: function getProperty(propertyName) {
					return $rootScope.account[propertyName];
				}
			};
		}
	]
);