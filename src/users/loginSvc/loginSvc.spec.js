/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('loginSvc', function() {
    "use strict";

    var loginSvc, $httpBackend, $rootScope, dummyUser, dummyRes;

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function(_loginSvc_, _$httpBackend_, _$rootScope_) {
        loginSvc = _loginSvc_;
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
        expect(loginSvc).toBeDefined();
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('loginSvc.checkLogin', function() {
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

            loginSvc.checkLogin(dummyUser, function(data) {
                expect(data.status).toBe('AUTH_OK');
            }, function() { });

            $httpBackend.flush();
        });
    });

    describe('loginSvc.isUserLoggedIn', function() {

        it('should return false for no logged in user', function() {
            expect(loginSvc.isUserLoggedIn()).not.toBeTruthy();
        });

        it('should return true for a logged in user', function() {
            $rootScope.account = {
                status: 'AUTH_OK'
            };

            expect(loginSvc.isUserLoggedIn()).toBeTruthy();
        });

        it('should return false in the case of login complications', function() {
            $rootScope.account = {
                status: 'AUTH_ERROR'
            };

            expect(loginSvc.isUserLoggedIn()).not.toBeTruthy();
        });
    });

    describe('loginSvc.logout', function() {

        beforeEach(function() {
            $rootScope.account = {
                username: 'dummy',
                name: 'Dummy Account'
            };
        });

        it('should log the user out', function() {
            loginSvc.logout();

            expect($rootScope.account).not.toBeDefined();
        });
    });

    describe('loginSvc.getProperty', function() {

        beforeEach(function() {
            $rootScope.account = dummyUser;
        });

        it('should return a value for a defined property', function() {
            expect(loginSvc.getProperty('username')).toBe(dummyUser.username);
        });

        it('should return nothing for an undefined property', function() {
            expect(loginSvc.getProperty('password')).not.toBeDefined();
        });
    });

    describe('loginSvc.getUserById', function() {
        it('should query the server for a user when an id is supplied', function() {
            $httpBackend.whenGET('/user?id=1').respond(200, dummyRes);
            loginSvc.getUserById(1, function() {}, function() {});
            $httpBackend.flush();
        });

        it('should return false if an id was not supplied', function() {
            expect(loginSvc.getUserById()).toBe(false);
        });
    });

});
