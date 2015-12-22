/* global angular */

angular.module('flintAndSteel')
.factory('userSvcMock',
    [
        '$q',
        function($q) {
            "use strict";

            var mockUserAccount = {
                _id: 1,
                username: 'MainManDarth',
                name: 'Darth Vader',
                likedIdeas: [ 'mock_idea' ]
            };

            var loggedIn = false;

            return {
                checkLogin: function checkLogin(account) {
                    var response = {};
                    response.data = {};
                    if (account.username === mockUserAccount.username) {
                        loggedIn = true;
                        response.data.status = 'AUTH_OK';
                    }
                    else {
                        loggedIn = false;
                        response.data.status = 'AUTH_ERROR';
                    }
                    return $q.when(response);
                },
                isUserLoggedIn: function isUserLoggedIn() {
                    return loggedIn;
                },
                logout: function logout() {
                    loggedIn = false;
                },
                getProperty: function getProperty(propertyName) {
                    return mockUserAccount[propertyName];
                },
                getUserById: function getUserById() {
                    return $q.when(mockUserAccount);
                }
            };
        }
    ]
);
