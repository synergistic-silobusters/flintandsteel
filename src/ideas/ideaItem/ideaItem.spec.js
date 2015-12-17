/* global angular */
/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('ideaItem', function() {
    "use strict";

    var DIRECTIVE_NAME = "idea-item";

    var scope, compile, element;

    function getCompiledElement() {
        var element = angular.element('<' + DIRECTIVE_NAME + '></' + DIRECTIVE_NAME + '>');
        var compiledElement = compile(element)(scope);
        scope.$digest();
        return compiledElement;
    }

    beforeEach(function() {
        module('flintAndSteel');
        module('ui.identicon');
        module('ideas/ideaItem/ideaItem.tpl.html');

        inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
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
