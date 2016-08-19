/* global angular */

angular.module('flintAndSteel')
.factory('userSvc',
    [
        '$http', '$rootScope', '$q', '$window',
        function($http, $rootScope, $q, $window) {
            "use strict";

            this.checkLogin = function checkLogin(account) {
                var encodedAccount = {}, def = $q.defer();

                encodedAccount.username = account.username;
                encodedAccount.password = window.btoa(account.password);

                $http.post('/api/v1/users/login', encodedAccount).then(function(response) {
                    $rootScope.account = response.data;
                    $window.ga('set', 'userId', $rootScope.account._id);
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

            var self = this; // Using "this" threw a fit

            function getAuthorizationString() {
                return 'Bearer ' +
                self.getProperty('_id') + ':' +
                self.getProperty('token');
            }

            this.setSubscription = function setSubscription(userId, isSubscribed) {
                return $http.patch('/api/v1/users/' + userId,
                [
                    { operation: 'modify', path: 'isSubscribed', value: isSubscribed }
                ],
                {
                    headers: {
                        'Authorization': getAuthorizationString()
                    }
                });
            };

            return {
                checkLogin: this.checkLogin,
                isUserLoggedIn: this.isUserLoggedIn,
                logout: this.logout,
                getProperty: this.getProperty,
                getUserById: this.getUserById,
                setSubscription: this.setSubscription
            };
        }
    ]
);
