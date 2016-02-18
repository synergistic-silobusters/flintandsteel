/* global angular */

angular.module('flintAndSteel')
.controller('LearnCtrl',
    [

        '$document', '$scope',
        function($document, $scope) {
            "use strict";

            $scope.learnItem0 = {title: "Login",
                                imgSource: "assets/learn/learnToLogin.gif",
                                orderImg: "1",
                                orderDesc: "2",
                                description: "Many collaboration activities on the site requires the user to login.  Please login in the upper right hand corner using the same credentials which you use to login to Windows."
                                };
            $scope.learnItem1 = {title: "Submit an Idea",
                                imgSource: "assets/learn/learnToSubmitIdea.gif",
                                orderImg: "2",
                                orderDesc: "1",
                                description: "Ideas are the foundation of 'Innovate'.  They can consist of a suggestion to fix a business problem, a technical problem, or a general innovation for the company."
                                };
            $scope.learnItem2 = {title: "Search Ideas",
                                imgSource: "assets/learn/learnToSearch.gif",
                                orderImg: "1",
                                orderDesc: "2",
                                description: "Searching is how you can find an ideas that have been submitted across the company.  The search bar looks through an ideas title, content, tags, and backs."
                                };
            $scope.learnItem3 = {title: "Like an Idea",
                                imgSource: "assets/learn/learnToLike.gif",
                                orderImg: "2",
                                orderDesc: "1",
                                description: "Likes are the simplest form of collaboration with an idea.  This gives the author a little boost of confidence to keep going!"
                                };
            $scope.learnItem4 = {title: "Comment on an Idea",
                                imgSource: "assets/learn/learnToComment.gif",
                                orderImg: "1",
                                orderDesc: "2",
                                description: "Comments are a way to give feedback to the author or team of an idea.  One could give ideas or constructive criticism to further the innovation."
                                };

            $scope.LearnItems = [$scope.learnItem0, $scope.learnItem1, $scope.learnItem2, $scope.learnItem3, $scope.learnItem4];

        }
    ]
);
