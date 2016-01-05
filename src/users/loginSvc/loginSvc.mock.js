/* global angular */

angular.module('flintAndSteel')
.factory('loginSvcMock',
    [
        function() {
            "use strict";

            var mockUserAccount = {
                _id: 1,
                username: 'MainManDarth',
                name: 'Darth Vader',
                likedIdeas: [ 'mock_idea' ]
            };

            var mockUserAccount2 = {
                _id: 2, 
                username: 'SonOfDarth', 
                name: 'Luke Skywalker'
            };

            var loggedIn = false;
            var userLoggedIn = 1;

            return {
                checkLogin: function checkLogin(account) {
                    if (userLoggedIn === 1 && account.username === mockUserAccount.username) {
                        loggedIn = true;
                    }
                    else if (userLoggedIn === 2 && account.username === mockUserAccount2.username) {
                        loggedIn = true;
                    }
                    else {
                        loggedIn = false;
                    }
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
                        return mockUserAccount;
                    }
                    else {
                        return mockUserAccount2;
                    }
                }
            };
        }
    ]
);
