Feature: Announcements Carousel

As a user
I want to see popular announcements
So that I know about upcoming things

  Scenario: carousel location
    Given that I'm on the home page
    Then I see the carousel at the top
    
  Scenario: maximum of 3 slides
    Given that I'm on the home page
    When I click the next button 3 times
    Then I should see the first slide again
    
  Scenario: carousel auto-advances every 8 seconds
    Given that I'm on the home page
    When I wait for 8 seconds
    Then the carousel scrolls to the next slide
