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

            function NotImplementedException(call) {
                this.name = 'NotImplementedException';
                this.message = 'Method ' + call + ' has not been implemented!';
                this.toString = function() {
                    return this.name + ': ' + this.message;
                };
            }

            var loggedIn = false;

            return {
                checkLogin: function checkLogin(account) {
                    if (account.username === mockUserAccount.username) {
                        loggedIn = true;
                    }
                    else {
                        loggedIn = false;
                    }
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
                updateAccount: function updateAccount() {
                    throw new NotImplementedException('updateAccount');
                },
                getUserById: function getUserById() {
                    return mockUserAccount;
                }
            };
        }
    ]
);
