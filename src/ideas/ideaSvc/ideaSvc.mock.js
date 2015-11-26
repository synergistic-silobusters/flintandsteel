/* global angular */
/* global moment */

angular.module('flintAndSteel')
.factory('ideaSvcMock',
    [
        function() {
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
                        text: 'management experience',
                        authorId: 4,
                        time: moment().subtract(7, 'days').calendar(),
                        types: [
                            { name: 'Experience' },
                            { name: 'Knowledge' }
                        ]
                    },
                    {
                        text: 'TEN MILLION DOLLARS',
                        authorId: 5,
                        time: moment().subtract(84, 'hours').calendar(),
                        types: [
                            { name: 'Funding' }
                        ]
                    }
                ],
                team: [
                    {
                        memberId: 1
                    }
                ],
                updates: [
                    {
                        text: 'The project started',
                        authorId: 6,
                        time: moment().calendar()
                    },
                    {
                        text: 'The project made some progress',
                        authorId: 7,
                        time: moment().subtract(2, 'hours').calendar()
                    }
                ]
            };

            return {
                postIdea: function postIdea(idea, successCb) {
                    successCb('Created');
                },
                getIdea: function getIdea(ideaId, successCb) {
                    successCb(mockIdea);
                },
                getIdeaHeaders: function getIdeaHeaders() {
                    return [
                        {
                            id: 'mock_idea',
                            title: 'The bestest Idea ever!',
                            author: 'Yash Kulshrestha',
                            likes: 23
                        }
                    ];
                },
                postComment: function postComment(parentId, text, authorId, successCb) {
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
                    successCb('Posted');
                },
                deleteComment: function deleteComment(commentId, successCb) {
                    for (var i = 0; i < mockIdea.comments.length; i++) {
                        if (mockIdea.comments[i].commentId === commentId) {
                            mockIdea.comments.splice(i, 1);
                            break;
                        }
                    }
                    successCb('Deleted');
                },
                updateIdea: function updateIdea(ideaId, property, data, successCb) {
                    mockIdea[property] = data;
                    successCb('OK');
                },
                likeIdea: function likeIdea(ideaId, userId, successCb) {
                    mockIdea.likes.push({userId: userId});
                    successCb('OK');
                },
                unlikeIdea: function unlikeIdea(ideaId, userId, successCb) {
                    mockIdea.likes.splice(mockIdea.likes.indexOf({userId: userId}), 1);
                    successCb('OK');
                },
                backIdea: function backIdea(ideaId, backObj, successCb) {
                    mockIdea.backs.push(backObj);
                    successCb('OK');
                },
                unbackIdea: function unbackIdea(ideaId, backObj, successCb) {
                    mockIdea.backs.splice(mockIdea.backs.indexOf(backObj), 1);
                    successCb('OK');
                },
                postUpdate: function postUpdate(ideaId, updateObj, successCb) {
                    mockIdea.updates.push(updateObj);
                    successCb('OK');
                },
                deleteUpdate: function deleteUpdate(ideaId, updateObj, successCb) {
                    mockIdea.updates.splice(mockIdea.updates.indexOf(updateObj), 1);
                    successCb('OK');
                },
                editIdea: function editIdea(ideaId, title, description, rolesreq, successCb) {
                    mockIdea.title = title;
                    mockIdea.description = description;
                    mockIdea.rolesreq = rolesreq;
                    mockIdea.timeModified = new Date().toISOString();
                    successCb('Edited');
                },
                deleteIdea: function deleteIdea(ideaId, successCb) {
                    successCb('Deleted!');
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
                }
            };
        }
    ]
);
