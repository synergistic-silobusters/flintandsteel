/* global angular */
/* global _ */

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

            this.likeIdea = function likeIdea(ideaId) {
                $rootScope.account.likedIdeas.push(ideaId);
                this.updateAccount($rootScope.account, function accountUpdateSuccess() {
                    // nothing *really* needs to happen here
                }, function accountUpdateError(data, status) {
                    console.log(status);
                });
            };

            this.unlikeIdea = function unlikeIdea(ideaId) {
                _.remove($rootScope.account.likedIdeas, function(item) {
                    return item === ideaId;
                });
                this.updateAccount($rootScope.account, function accountUpdateSuccess() {
                    // nothing *really* needs to happen here
                }, function accountUpdateError(data, status) {
                    console.log(status);
                });
            };

            this.updateAccount = function updateAccount(account, successCb, errorCb) {
                $http.post('/updateaccount', account)
                    .success(successCb)
                    .error(errorCb);
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
                likeIdea: this.likeIdea,
                unlikeIdea: this.unlikeIdea,
                updateAccount: this.updateAccount,
                getUserById: this.getUserById
            };
        }
    ]
);
