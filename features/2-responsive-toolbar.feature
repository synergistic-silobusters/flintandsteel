Feature:
  As a user
  I want to be able to browse the website on desktop and mobile
  So that I can find information quickly
  
  Scenario: toolbar layout on mobile
    Given I'm on the home page on mobile
    Then I should see the menu button on the toolbar
    And I should see the app icon
    
  Scenario: toolbar layout on mobile while not logged in
    Given I'm on the home page on mobile
    Then I should see the login button
  
  Scenario: toolbar layout on mobile while logged in
    Given I'm on the home page on mobile
    And I log in as "test1"
    Then I should see my identicon
  
  Scenario: opening the sidenav
    Given that I'm on the webiste on mobile
    When I click on the menu button
    Then I should see the sidenav
  
  Scenario Outline: sidenav contents
    Given that I have the sidenav open
    Then I should see <listitem> in the sidenav
    
    Examples:
    | "Create"   |
    | "Browse"   |
    | "Learn"    |
    | "Feedback" |
