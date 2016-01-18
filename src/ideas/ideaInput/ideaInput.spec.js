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
        module('flintAndSteel');
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
});
