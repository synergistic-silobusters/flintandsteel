describe('SignupViewCtrl', function() {
	var scope, ctrl, $state, $mdToast, loginSvcMock;

	beforeEach(module('flintAndSteel'));
	beforeEach(module('ui.router'));

	beforeEach(inject(function ($rootScope, $controller, _$state_, _$mdToast_, _loginSvcMock_) {
		scope = $rootScope.$new();
		$state = _$state_;
		$mdToast = _$mdToast_;
		loginSvcMock = _loginSvcMock_;

		spyOn($state, 'go');
		spyOn($mdToast, 'show');

		ctrl = $controller('SignupViewCtrl', {
			$scope: scope,
			$state: $state,
			$mdToast: $mdToast,
			loginSvc: loginSvcMock
		});
	}));

	it('should exist', function() {
		expect(ctrl).toBeDefined();
	});

	describe('$scope.completeSignUp', function() {
		beforeEach(function() {
			spyOn(loginSvcMock, 'addUser').and.callFake(function(account, successCb, errorCb) {
				successCb('Created');
			});
		});

		it('should sign up a new user', function() {
			scope.completeSignUp({ name: 'Guybrush Threepwood' });

			expect($mdToast.show).toHaveBeenCalled();
			expect($state.go).toHaveBeenCalledWith('login');
		});	
	});
});