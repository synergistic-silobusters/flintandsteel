Feature:
  As a user
  I want to see a summary of an idea
  So that I can see if it is interesting

  Scenario: card has a title for the idea
    Given I am on the home page
    And there is an idea card on the page
    Then I should see the idea title in the idea card
  
  Scenario: card has an abstract for the idea
    Given I am on the home page
    And there is an idea card on the page
    Then I should see the the abstract in the idea card
  
  Scenario: card has an interaction bar
    Given I am on the home page
    And there is an idea card on the page
    Then I should see the interaction bar in the idea card
    
  Scenario: card has author with identicon
    Given I am on the home page
    And there is an idea card on the page
    Then I should see the author with identicon in the idea card
  
  Scenario: card has a placeholder for the hero image
    Given I am on the home page
    And there is an idea card on the page
    Then I should see the hero image placeholder in the idea card
