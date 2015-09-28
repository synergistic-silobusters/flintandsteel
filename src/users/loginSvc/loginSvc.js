/* global angular */
/* global _ */

angular.module('flintAndSteel')
.factory('loginSvc', 
    [
        '$http', '$rootScope',
        function($http, $rootScope) {
            "use strict";

            this.checkLogin = function checkLogin(account, successCb, errorCb){
                //console.log(account);
                $http.post('/login', account)
                    .success(function (data, status, headers, config) {
                        $rootScope.account = data;
                        successCb(data, status, headers, config);
                    })
                    .error(errorCb);
            };

            this.addUser = function addUser(account, successCb, errorCb) {
                //console.log(account);
                $http.get('/uniqueid?for=user')
                    .success(function getIdSucess(data) {
                        account.id = data;
                        account.likedIdeas = [];
                        $http.post('/signup', account)
                            .success(successCb)
                            .error(errorCb);
                    })
                    .error(function getIdFailed(data, status) {
                        console.log(status);
                    });
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
                _.remove($rootScope.account.likedIdeas, function (item) {
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
            
            this.checkValidUsername = function checkValidUsername(username, successCb, errorCb) {
                if(username) {
                    $http.get('/isuniqueuser?user=' + username)
                        .success(successCb)
                        .error(errorCb);
                }
                else {
                    return false;
                }
            };

            return {
                checkLogin: this.checkLogin,
                addUser: this.addUser,
                isUserLoggedIn: this.isUserLoggedIn,
                logout: this.logout,
                getProperty: this.getProperty,
                likeIdea: this.likeIdea,
                unlikeIdea: this.unlikeIdea,
                updateAccount: this.updateAccount,
                checkValidUsername: this.checkValidUsername
            };
        }
    ]
);