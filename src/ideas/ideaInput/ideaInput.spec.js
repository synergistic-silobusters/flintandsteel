/* global angular */
/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('ideaInput', function() {
    "use strict";

    var DIRECTIVE_NAME = "idea-input";

    var scope, compile, element, eventSvcMock;

    function getCompiledElement(ele) {
        var element = ele || angular.element('<' + DIRECTIVE_NAME + '></' + DIRECTIVE_NAME + '>');
        var compiledElement = compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }

    beforeEach(function() {
        module('flintAndSteel', function($controllerProvider) {
            // Only care about the portions of controller that are pertinent
            // to the test. So we'll mock those in.
            $controllerProvider.register('IdeaInputCtrl', function($scope) {
                $scope.cancelFn = $scope.cancelFn || null;
                $scope.cancelBtnText = $scope.cancelBtnText || null;
            });
        });
        module('ui.identicon');
        module('ideas/ideaInput/ideaInput.tpl.html');

        inject(function($rootScope, $compile, _eventSvcMock_) {
            scope = $rootScope.$new();
            eventSvcMock = _eventSvcMock_;
            compile = $compile;
        });

        var undef;

        element = undef;
    });

    it('should exist', function() {
        element = getCompiledElement();
        expect(element).toBeDefined();
    });

    describe('without a cancel option', function() {

        beforeEach(function() {
            element = getCompiledElement('<' + DIRECTIVE_NAME +
                ' submit-fn="testSubmit(idea)" submit-btn-text="Submit Idea"></' +
                DIRECTIVE_NAME + '>');
        });

        it('should only have one button', function() {
            expect(element.find('button').length).toEqual(1);
        });

        it('should have the submit text for the submit button', function() {
            expect(element.find('button')["0"].outerHTML).toContain("Submit Idea");
        });

    });

    describe('with a cancel option', function() {

        beforeEach(function() {
            element = getCompiledElement('<' + DIRECTIVE_NAME +
                ' submit-fn="testSubmit(idea)" submit-btn-text="Submit Idea" cancel-fn="testCancel()" cancel-btn-text="Cancel"></' +
                DIRECTIVE_NAME + '>');
        });

        it('should have two buttons', function() {
            expect(element.find('button').length).toEqual(2);
        });

        it('should have the cancel text for the cancel button', function() {
            expect(element.find('button')["1"].outerHTML).toContain("Cancel");
        });

    });
});
