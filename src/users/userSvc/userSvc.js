/* global angular */

angular.module('flintAndSteel')
.factory('userSvc',
    [
        '$http', '$rootScope', '$q',
        function($http, $rootScope, $q) {
            "use strict";

            this.checkLogin = function checkLogin(account) {
                var encodedAccount = {}, def = $q.defer();

                encodedAccount.username = account.username;
                encodedAccount.password = window.btoa(account.password);

                $http.post('/api/v1/users/login', encodedAccount).then(function(response) {
                    $rootScope.account = response.data;
                    def.resolve(response);
                },
                function(response) {
                    def.reject(response);
                });

                return def.promise;
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

            this.getUserById = function getUserById(userId) {
                if (userId) {
                    return $http.get('/api/v1/users/' + userId);
                }
                else {
                    return $q.when(false);
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
