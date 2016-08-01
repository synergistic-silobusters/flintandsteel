Feature: Mobile User Menu

As a User
I want to only have the identicon for login on mobile
so that the bar is not cluttered

  Scenario: User menu on mobile is an identicon
    Given that I'm on the mobile version of the website
    When I login as "test1"
    Then I should only see my identicon

  Scenario: User menu on desktop is user name and identicon
    Given that I'm on the desktop website
    When I login as "test1"
    Then I should see my name as well as an identicon
