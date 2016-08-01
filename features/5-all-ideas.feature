Feature: All ideas on home page
  
As a user
I want to see all ideas
So that I can better the company by innovating across silos
  
  Scenario: All ideas show up below top and new ideas
    Given that I'm on the home page
    When I scroll past top and trending ideas
    Then I see a section for all ideas
    And I see up to 4 ideas under the section
  
  @manual
  Scenario: infinite scroll
    Given that I'm on the home page
    When I start scrolling past the shown ideas
    Then more ideas appear in the list
  
  Scenario: clicking an idea item
    Given that I'm on the home page
    When I click on an idea in the all ideas section
    Then I am taken to the idea

  Scenario: return to top
    Given that I'm on the home page
    When I scroll past the new ideas section
    Then a return to the top button appears
    
  Scenario: return to top button functionality
    Given that I'm on the home page
    When I click on the return to top button
    Then I get taken to the top of the page
