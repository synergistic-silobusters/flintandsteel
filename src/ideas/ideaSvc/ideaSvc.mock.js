/* global angular */
/* global moment */

angular.module('flintAndSteel')
.factory('ideaSvcMock',
    [
        '$q',
        function($q) {
            "use strict";

            var mockIdea = {
                id: 'mock_idea',
                _id: 'mock_idea',
                title: 'The bestest Idea ever!',
                description: 'Apophenia order-flow systema futurity garage sentient car advert. ' +
                    'Footage 3D-printed Legba free-market lights courier camera Kowloon youtube ' +
                    'fluidity euro-pop garage bicycle augmented reality. Dome military-grade ' +
                    'faded meta--space vehicle warehouse. Computer concrete corrupted vehicle ' +
                    'tower dead knife cyber-camera augmented reality table shrine apophenia ' +
                    'tiger-team-ware soul-delay. Hacker pistol into plastic realism sub-orbital ' +
                    'futurity girl geodesic disposable boat sentient tanto urban. Plastic alcohol ' +
                    'bicycle carbon courier spook gang wristwatch katana sensory sign long-chain ' +
                    'hydrocarbons assault nano. ',
                authorId: 1,
                author: {name: 'Darth Vader'},
                image: '../assets/defaultideahero.jpg',
                likes: [
                    {userId: 1},
                    {userId: 2},
                    {userId: 3},
                    {userId: 4},
                    {userId: 5},
                    {userId: 6},
                    {userId: 7}
                ],
                managerLikes: 6,
                comments: [
                    {
                        commentId: 1,
                        parentId: 'mock_idea',
                        text: 'This sounds cool',
                        authorId: 1,
                        timeCreated: moment().subtract(1, 'days').calendar(),
                        timeModified: moment().subtract(1, 'days').calendar()
                    },
                    {
                        commentId: 2,
                        parentId: 'mock_idea',
                        text: 'Hey, I was thinking the same thing!',
                        authorId: 2,
                        timeCreated: moment().subtract(4, 'hours').calendar(),
                        timeModified: moment().subtract(4, 'hours').calendar()
                    },
                    {
                        commentId: 3,
                        parentId: 'mock_idea',
                        text: 'This is gold, gold I tell you!',
                        authorId: 3,
                        timeCreated: moment().subtract(30, 'minutes').calendar(),
                        timeModified: moment().subtract(30, 'minutes').calendar()
                    }
                ],
                backs: [
                    {
                        authorId: 1,
                        timeCreated: moment().subtract(6, 'days').calendar(),
                        timeModified: moment().subtract(4, 'days').calendar(),
                        types: [
                            { name: 'Owner'}
                        ]
                    },
                    {
                        text: 'management experience',
                        authorId: 4,
                        timeCreated: moment().subtract(7, 'days').calendar(),
                        types: [
                            { name: 'Experience' },
                            { name: 'Knowledge' }
                        ]
                    },
                    {
                        _id: 11,
                        text: 'TEN MILLION DOLLARS',
                        authorId: 5,
                        timeCreated: moment().subtract(84, 'hours').calendar(),
                        types: [
                            { name: 'Funding' }
                        ]
                    }
                ],
                team: [
                    {
                        memberId: 1,
                        member: { mail: 'dvader@gmail.com' }
                    }
                ],
                updates: [
                    {
                        text: 'The project started',
                        authorId: 6,
                        timeCreated: moment().calendar()
                    },
                    {
                        text: 'The project made some progress',
                        authorId: 7,
                        timeCreated: moment().subtract(2, 'hours').calendar()
                    }
                ],
                tags: [
                    "thisIsATag",
                    "tagAllTheThings"
                ],
                complexity: []
            };

            return {
                postIdea: function postIdea() {
                    return $q.when({data: {status: 'Created'}});
                },
                getIdea: function getIdea() {
                    return $q.when({ data: mockIdea });
                },
                getIdeaHeaders: function getIdeaHeaders() {
                    return $q.when({ data: [
                        {
                            id: 'mock_idea',
                            title: 'The bestest Idea ever!',
                            author: 'Yash Kulshrestha',
                            authorId: 1,
                            likes: 23
                        }
                    ]});
                },
                postComment: function postComment(parentId, text, authorId) {
                    mockIdea.comments.push(
                        {
                            commentId: 4,
                            parentId: parentId,
                            text: text,
                            authorId: authorId,
                            timeCreated: new Date().toISOString(),
                            timeModified: new Date().toISOString()
                        }
                    );
                    return $q.when('Posted');
                },
                deleteComment: function deleteComment(commentId) {
                    for (var i = 0; i < mockIdea.comments.length; i++) {
                        if (mockIdea.comments[i].commentId === commentId) {
                            mockIdea.comments.splice(i, 1);
                            break;
                        }
                    }
                    return $q.when('Deleted');
                },
                updateIdea: function updateIdea(ideaId, property, data) {
                    mockIdea[property] = data;
                    return $q.when('OK');
                },
                addInteraction: function addInteraction(ideaId, type, object) {
                    mockIdea[type].push(object);
                    return $q.when('OK');
                },
                removeInteraction: function removeInteraction(ideaId, type, object) {
                    mockIdea[type].splice(mockIdea[type].indexOf(object), 1);
                    return $q.when('OK');
                },
                editBack: function editBack(ideaId, backId, newBack) {
                    for (var i = 0; i < mockIdea.backs.length; i++) {
                        if (mockIdea.backs[i]._id === backId) {
                            mockIdea.backs.splice(i, 1, newBack);
                            return $q.when('OK');
                        }
                    }
                },
                editIdea: function editIdea(ideaId, title, description, tags, rolesreq) {
                    mockIdea.title = title;
                    mockIdea.description = description;
                    mockIdea.tags = tags;
                    mockIdea.rolesreq = rolesreq;
                    mockIdea.timeModified = new Date().toISOString();
                    return $q.when('Edited');
                },
                editIdeaRating: function editIdeaRating(ideaId, value) {
                    mockIdea.complexity = value;
                    return $q.when('Edited');
                },
                deleteIdea: function deleteIdea() {
                    return $q.when('Deleted!');
                },
                getBackTypeChips: function getBackTypeChips() {
                    var types = [
                        { name: 'Experience' },
                        { name: 'Funding' },
                        { name: 'Time' },
                        { name: 'Knowledge' },
                        { name: 'Social Network'},
                        { name: 'Materials' },
                        { name: 'Test Chip'}
                    ];
                    return types.map(function(type) {
                        type._lowername = type.name.toLowerCase().replace(/[ ]/g, '-').replace('?', '');
                        return type;
                    });
                },
                dialogRemoveFromTeamCtrl: function dialogRemoveFromTeamCtrl($scope, $mdDialog) {
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };

                    $scope.submitDelete = function() {
                        $mdDialog.hide(true);
                    };
                },
                getUserIdeasById: function getUserIdeasById() {
                    return $q.when({ data: [
                        {
                            id: 'mock_idea',
                            title: 'The bestest Idea ever!',
                            author: 'Yash Kulshrestha',
                            authorId: 1
                        }
                    ]});
                },
                getUserBacksById: function getUserBacksById() {
                    return $q.when({ data: [
                        {
                            id: 'mock_idea',
                            title: 'The bestest Idea ever!',
                            author: 'Yash Kulshrestha',
                            authorId: 1
                        }
                    ]});
                },
                mockData: mockIdea
            };
        }
    ]
);
