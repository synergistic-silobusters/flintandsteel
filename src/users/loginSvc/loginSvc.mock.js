/* global angular */

angular.module('flintAndSteel')
.factory('loginSvcMock', 
	[
		function() {
			var mockUserAccount = {
				id: 1,
				username: 'MainManDarth',
				name: 'Darth Vader',
				likedIdeas: [ 'mock_idea' ]
			};

			function NotImplementedException(call) {
				this.name = 'NotImplementedException';
				this.message = 'Method ' + call + ' has not been implemented!';
				this.toString = function() {
					return this.name + ': ' + this.message;
				};
			}

			return {
				checkLogin: function checkLogin(account, successCb, errorCb){
					throw new NotImplementedException('checkLogin');
				},
				addUser: function addUser(account, successCb, errorCb) {
					throw new NotImplementedException('addUser');
				},
				isUserLoggedIn: function isUserLoggedIn() {
					throw new NotImplementedException('isUserLoggedIn');
				},
				logout: function logout() {
					throw new NotImplementedException('logout');
				},
				getProperty: function getProperty(propertyName) {
					return mockUserAccount[propertyName];
				},
				likeIdea: function likeIdea(ideaId) {
					throw new NotImplementedException('likeIdea');
				},
				unlikeIdea: function unlikeIdea(ideaId) {
					throw new NotImplementedException('unlikeIdea');
				},
				updateAccount: function updateAccount(account, successCb, errorCb) {
					throw new NotImplementedException('updateAccount');
				},
				checkValidUsername: function checkValidUsername(username, successCb, errorCb) {
					throw new NotImplementedException('checkValidUsername');
				}
			};
		}
	]
);