/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('startFromFilter', function() {
    "use strict";

    var $filter, startFrom;

    var testList = [
        "First Element",
        "Second Element",
        "Third Element",
        4,
        5,
        6,
        "Nitrogen",
        "O",
        {text: "It doesn't matter what the contents are."},
        "The Last Element"
    ];

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function(_$filter_) {
        $filter = _$filter_;

        startFrom = $filter('startFrom');
    }));

    it('should not alter the original array', function() {
        var index = 8;
        var originalLength = testList.length;
        startFrom(testList, index);

        expect(testList.length).toEqual(originalLength);
    });

    it('should return the full array if starting from zero (first index)', function() {
        var index = 0;
        var result = startFrom(testList, index);

        expect(result).toEqual(testList);
    });

    it('should return a subset of the array starting from the provided index', function() {
        var index = 4;
        var result = startFrom(testList, index);

        expect(result[0]).toBe(testList[index]);
        expect(result.length).toEqual((testList.length) - index);
    });

    it('should be able to convert string representations of integers to integers', function() {
        var index = "4";
        var parsedIndex = +index;
        var result = startFrom(testList, index);

        expect(result[0]).toBe(testList[parsedIndex]);
        expect(result.length).toEqual((testList.length) - parsedIndex);
    });

    it('should throw an error if the first argument is not an Array', function() {
        var expectedErrMsg = "arg0 is not valid! Expected array";

        var index = 4;
        expect(function() {
            startFrom("This is not an array", index);
        }).toThrowError(TypeError, expectedErrMsg);
    });

    it('should throw an error if the second argument is not parsable to an integer', function() {
        var expectedErrMsg = "arg1 is not valid! Expected to be parsable to an integer";

        var index = 3.14;
        expect(function() {
            startFrom(testList, index);
        }).toThrowError(TypeError, expectedErrMsg);

        index = {number: 0};
        expect(function() {
            startFrom(testList, index);
        }).toThrowError(TypeError, expectedErrMsg);

        index = "zero";
        expect(function() {
            startFrom(testList, index);
        }).toThrowError(TypeError, expectedErrMsg);

        index = "0 is zero";
        expect(function() {
            startFrom(testList, index);
        }).toThrowError(TypeError, expectedErrMsg);
    });
});
