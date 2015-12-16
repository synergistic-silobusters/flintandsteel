/* global angular */

angular.module('flintAndSteel')
.service('paginateSvc',
    [
        function() {
            "use strict";

            this.createPages = function createPages(content, numPages) {
                var pages = [];
                var contentLength = content.length;
                var numPerPage = Math.ceil(content.length / numPages);

                for (var columnIndex = 0, index = 0;
                    columnIndex < numPages, index < contentLength;
                    columnIndex++, index += numPerPage) {

                    pages.push({start: index, length: numPerPage});
                }
                return pages;
            };
        }
    ]
);
