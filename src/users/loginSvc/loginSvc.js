/* global angular */

angular.module('flintAndSteel')
.factory('loginSvc',
    [
        '$http', '$rootScope',
        function($http, $rootScope) {
            "use strict";

            this.checkLogin = function checkLogin(account, successCb, errorCb) {
                var encodedAccount = {};
                encodedAccount.username = account.username;
                encodedAccount.password = window.btoa(account.password);
                $http.post('/login', encodedAccount)
                    .success(function(data, status, headers, config) {
                        $rootScope.account = data;
                        successCb(data, status, headers, config);
                    })
                    .error(errorCb);
            };

            this.isUserLoggedIn = function isUserLoggedIn() {
                if (typeof $rootScope.account === 'undefined') {
                    return false;
                }
                return $rootScope.account.status === 'AUTH_OK';
            };

            this.logout = function logout() {
                $rootScope.account = undefined;
            };

            this.getProperty = function getProperty(propertyName) {
                return $rootScope.account[propertyName];
            };

            this.getUserById = function getUserById(userId, successCb, errorCb) {
                if (userId) {
                    $http.get('/user?id=' + userId)
                        .success(successCb)
                        .error(errorCb);
                }
                else {
                    return false;
                }
            };

            return {
                checkLogin: this.checkLogin,
                isUserLoggedIn: this.isUserLoggedIn,
                logout: this.logout,
                getProperty: this.getProperty,
                getUserById: this.getUserById
            };
        }
    ]
);
