describe('loginSvc', function() {
	var loginSvc, $httpBackend, $rootScope, dummyUser, dummyRes;

	beforeEach(module('flintAndSteel'));

	beforeEach(inject(function (_loginSvc_, _$httpBackend_, _$rootScope_) {
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
			$httpBackend.expectPOST('/login', dummyUser);

			loginSvc.checkLogin(dummyUser, function (data) {
				expect(data.status).toBe('AUTH_OKAY');
			}, function (data, status, headers, config) {

			});

			$httpBackend.flush();
		});
	});

	describe('loginSvc.addUser', function() {
		var addUserHandler, uniqueIdHandler;

		beforeEach(function() {
			addUserHandler = $httpBackend.whenPOST('/signup', dummyUser)
								.respond(201, 'Created');
			uniqueIdHandler = $httpBackend.whenGET('/uniqueid?for=user')
								.respond(200, 9001);
		});

		it('should register a new user', function() {
			$httpBackend.expectGET('/uniqueid?for=user');
			$httpBackend.expectPOST('/signup', dummyUser);

			loginSvc.addUser(dummyUser, function (data) {
				expect(data).toBe('Created');
			}, function (data, status, headers, config) {

			});

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

	describe('loginSvc.likeIdea', function() {
		var dummyLikedIdea;

		beforeEach(function() {
			dummyLikedIdea = 'dummy_liked_idea';
			$rootScope.account = dummyUser;

			spyOn(loginSvc, 'updateAccount').and.callFake(function(account, successCb, errorCb) {
				successCb('OK');
			});
		});

		it('should add the ideaId to the array of liked ideas', function() {
			loginSvc.likeIdea(dummyLikedIdea);

			expect($rootScope.account.likedIdeas).toEqual(jasmine.arrayContaining([dummyLikedIdea]));
		});
	});

	describe('loginSvc.unlikeIdea', function() {
		var dummyLikedIdea;

		beforeEach(function() {
			dummyLikedIdea = 'dummy_liked_idea';
			$rootScope.account = dummyUser;
			$rootScope.account.likedIdeas.push(dummyLikedIdea);

			spyOn(loginSvc, 'updateAccount').and.callFake(function(account, successCb, errorCb) {
				successCb('OK');
			});
		});

		it('should add the ideaId to the array of liked ideas', function() {
			expect($rootScope.account.likedIdeas).toEqual(jasmine.arrayContaining([dummyLikedIdea]));

			loginSvc.unlikeIdea(dummyLikedIdea);

			expect($rootScope.account.likedIdeas).not.toEqual(jasmine.arrayContaining([dummyLikedIdea]));
		});
	});

	describe('loginSvc.updateAccount', function() {
		var updateAccountHandler, updatedUser;

		beforeEach(function() {
			updatedUser = dummyUser;
			updatedUser.username = 'theBestDummyV2';
			updateAccountHandler = $httpBackend.whenPOST('/updateaccount', updatedUser)
										.respond(200, 'OK');
		});

		it('should update the user account', function() {
			$httpBackend.expectPOST('/updateaccount', updatedUser);

			loginSvc.updateAccount(updatedUser, function (data) {
				expect(data).toBe('OK');
			}, function (data, status, headers, config) {

			});

			$httpBackend.flush();
		});

	});

	describe('loginSvc.checkValidUsername', function() {
		var checkValidUsernameHandler;

		beforeEach(function() {
			checkValidUsernameHandler = $httpBackend.whenGET('/isuniqueuser?user=dummy')
											.respond(200, true);
		});

		it('should return true for a unique user', function() {
			$httpBackend.expectGET('/isuniqueuser?user=dummy');

			loginSvc.checkValidUsername('dummy', function (data) {
				expect(data).toBe(true);
			}, function (data, status, headers, config) {

			});

			$httpBackend.flush();
		});

		it('should return false for a duplicate user', function() {
			checkValidUsernameHandler.respond(200, false);
			$httpBackend.expectGET('/isuniqueuser?user=dummy');

			loginSvc.checkValidUsername('dummy', function (data) {
				expect(data).toBe(false);
			}, function (data, status, headers, config) {

			});

			$httpBackend.flush();
		});
	});

});