/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('userSvc', function() {
    "use strict";

    var userSvc, $httpBackend, $rootScope, $q, dummyUser, dummyRes;

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function(_userSvc_, _$httpBackend_, _$rootScope_, _$q_) {
        userSvc = _userSvc_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $q = _$q_;

        dummyUser = {
            id: 'dummy_user',
            username: 'theBestDummy',
            password: 'password',
            name: 'Dummy User',
            likedIdeas: ['mock_idea', 'dummy_idea']
        };

        dummyRes = dummyUser;
        dummyRes.password = undefined;
        dummyRes.status = 'AUTH_OK';
    }));

    it('should exist', function() {
        expect(userSvc).toBeDefined();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('userSvc.checkLogin', function() {
        var checkLoginHandler;

        beforeEach(function() {
            checkLoginHandler = $httpBackend.whenPOST('/api/v1/users/login', dummyUser).respond(200, dummyRes);
        });

        it('should return a good response for valid details', function() {
            var encodedDummy = {};
            encodedDummy.username = dummyUser.username;
            encodedDummy.password = window.btoa(dummyUser.password);
            $httpBackend.expectPOST('/api/v1/users/login', encodedDummy).respond({status: 'AUTH_OK'});

            userSvc.checkLogin(dummyUser).then(function(response) {
                expect(response.data.status).toBe('AUTH_OK');
            }, function() { });

            $httpBackend.flush();
        });
    });

    describe('userSvc.isUserLoggedIn', function() {

        it('should return false for no logged in user', function() {
            expect(userSvc.isUserLoggedIn()).not.toBeTruthy();
        });

        it('should return true for a logged in user', function() {
            $rootScope.account = {
                status: 'AUTH_OK'
            };

            expect(userSvc.isUserLoggedIn()).toBeTruthy();
        });

        it('should return false in the case of login complications', function() {
            $rootScope.account = {
                status: 'AUTH_ERROR'
            };

            expect(userSvc.isUserLoggedIn()).not.toBeTruthy();
        });
    });

    describe('userSvc.logout', function() {

        beforeEach(function() {
            $rootScope.account = {
                username: 'dummy',
                name: 'Dummy Account'
            };
        });

        it('should log the user out', function() {
            userSvc.logout();

            expect($rootScope.account).not.toBeDefined();
        });
    });

    describe('userSvc.getProperty', function() {

        beforeEach(function() {
            $rootScope.account = dummyUser;
        });

        it('should return a value for a defined property', function() {
            expect(userSvc.getProperty('username')).toBe(dummyUser.username);
        });

        it('should return nothing for an undefined property', function() {
            expect(userSvc.getProperty('password')).not.toBeDefined();
        });
    });

    describe('userSvc.getUserById', function() {
        it('should query the server for a user when an id is supplied', function() {
            $httpBackend.whenGET('/api/v1/users/1').respond(200, dummyRes);
            userSvc.getUserById(1).then(function() {}, function() {});
            $httpBackend.flush();
        });

        it('should return false if an id was not supplied', function() {
            userSvc.getUserById().then(function(result) {
                expect(result).toBe(false);
            });

        });
    });

});
