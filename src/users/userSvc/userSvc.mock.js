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
                likedIdeas: [ 'mock_idea' ],
                isSubscribed: false
            };

            var mockUserAccount2 = {
                _id: 2,
                username: 'SonOfDarth',
                name: 'Luke Skywalker',
                isSubscribed: false
            };

            var loggedIn = false;
            var userLoggedIn = 1;

            return {
                checkLogin: function checkLogin(account) {
                    var response = {};
                    response.data = {};

                    if (userLoggedIn === 1 && account.username === mockUserAccount.username) {
                        loggedIn = true;
                        response.data.status = 'AUTH_OK';
                    }
                    else if (userLoggedIn === 2 && account.username === mockUserAccount2.username) {
                        loggedIn = true;
                        response.data.status = 'AUTH_OK';
                    }
                    else if (userLoggedIn === 2 && account.user !== mockUserAccount2.username) {
                        loggedIn = false;
                        response.data.status = 'AUTH_ERROR';
                    }
                    else {
                        loggedIn = false;
                        response.data.status = 'USER_NOT_FOUND';
                    }
                    return $q.when(response);
                },
                switchLogin: function switchLogin(num) {
                    if (num === 1) {
                        userLoggedIn = 1;
                    }
                    else {
                        userLoggedIn = 2;
                    }
                },
                isUserLoggedIn: function isUserLoggedIn() {
                    return loggedIn;
                },
                logout: function logout() {
                    loggedIn = false;
                },
                getProperty: function getProperty(propertyName) {
                    if (userLoggedIn === 1) {
                        return mockUserAccount[propertyName];
                    }
                    else {
                        return mockUserAccount2[propertyName];
                    }
                },
                getUserById: function getUserById() {
                    if (userLoggedIn === 1) {
                        return $q.when(mockUserAccount);
                    }
                    else {
                        return $q.when(mockUserAccount2);
                    }
                }
            };
        }
    ]
);
