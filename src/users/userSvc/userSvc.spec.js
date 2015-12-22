/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('userSvc', function() {
    "use strict";

    var userSvc, $httpBackend, $rootScope, dummyUser, dummyRes;

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function(_userSvc_, _$httpBackend_, _$rootScope_) {
        userSvc = _userSvc_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;

        dummyUser = {
            id: 'dummy_user',
            username: 'theBestDummy',
            password: 'password',
            name: 'Dummy User',
            likedIdeas: ['mock_idea', 'dummy_idea']
        };

        dummyRes = dummyUser;
        dummyRes.password = undefined;
        dummyRes.status = 'AUTH_OKAY';
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
            checkLoginHandler = $httpBackend.whenPOST('/login', dummyUser)
                                    .respond(200, dummyRes);
        });

        it('should return a good response for valid details', function() {
            var encodedDummy = {};
            encodedDummy.username = dummyUser.username;
            encodedDummy.password = window.btoa(dummyUser.password);
            $httpBackend.expectPOST('/login', encodedDummy).respond({status: 'AUTH_OK'});

            userSvc.checkLogin(dummyUser, function(data) {
                expect(data.status).toBe('AUTH_OK');
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
            $httpBackend.whenGET('/user?id=1').respond(200, dummyRes);
            userSvc.getUserById(1, function() {}, function() {});
            $httpBackend.flush();
        });

        it('should return false if an id was not supplied', function() {
            expect(userSvc.getUserById()).toBe(false);
        });
    });

});
