@login-gui
Feature: Login
As a user I want to be able to login with valid 
credentials and fail to login without them.

@standard(others)_user

Scenario Outline: Login in a way as standard user (check radio "others" )
    Given The user navigates to the login page
    When The user enters credentials "<usernameKey>" and "<passwordKey>"
    Then The Home page is displayed
Examples: 
    | usernameKey | passwordKey |
    | CPSA        | CPPSWD      |
    | CPUSER      | CPUSERPSWD  | 
    

@standard(others)_user

Scenario: Fail login for standard user (check radio "others" )
    Given The user navigates to the login page
    When The user enters credentials "CPUSERINCORRECT" and "CPPSWDINCORRECT"
    Then The Login page is displayed

@admin_user

Scenario: Login as a System Administrator user
    Given The user navigates to the login page
    When The user enters "CPPSWD" only
    Then The Home page is displayed

@admin_user_fail    

Scenario: Fail to login as a System Administrator user
    Given The user navigates to the login page
    When The user enters incorrect SA password "CPPSWDINCORRECT"
    Then The Login page is displayed
    Then The "IncorrectCredentials" error is displayed


Scenario Outline: User see login form
    Given The user navigates to the login page
    Then text "<textKey>" on login page will be visible
#     Then text "accountLabel" on login page will be visible
#    Then The user can see the radio buttons for choosing user
#    And user can see the username field
#    And user can see the password field
#    And user can see the button "Login"
Examples:
    | textKey       |
    | accountLabel  |
    | adminOption   |
    | othersOption  |
    | passwordLabel |
    