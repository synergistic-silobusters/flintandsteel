Feature: Trending and new ideas

As a user
I want to see the trending ideas and recent ideas
So that I see what is popular

  Scenario: Top 4 trending ideas are on the homepage
    Given that I'm on the innovate home page and my window is large enough
    Then I see 4 ideas in the trending ideas section

  Scenario: The 4 newest ideas are on the homepage
    Given that I'm on the innovate home page and my window is large enough
    Then I see 4 new ideas in the new ideas section

  Scenario: Top 3 trending ideas are on the homepage
    Given that I'm on the innovate home page and my window is medium sized
    Then I see 3 ideas in the trending ideas section

  Scenario: The 3 newest ideas are on the homepage
    Given that I'm on the innovate home page and my window is medium sized
    Then I see 3 new ideas in the new ideas section

  Scenario: Top 2 trending ideas should be on the mobile homepage
    Given that I'm on the mobile innovate page
    Then I see 2 ideas in the trending ideas section

  Scenario: Top 2 trending ideas should be on the mobile homepage
    Given that I'm on the mobile innovate page
    Then I see 2 ideas in the new ideas section

  Scenario: Clicking on an idea summary takes to the idea page
    Given that I'm on the innovate home page
    When I click on an idea summary
    Then I am taken to the idea view

  Scenario: New trending idea
    Given that I'm on the innovate home page
    When an idea starts trending
    Then the idea should appear in the trending ideas section

  Scenario: New posted idea
    Given that I'm on the innovate home page
    When an idea gets posted
    Then the idea should appear in the new ideas section
