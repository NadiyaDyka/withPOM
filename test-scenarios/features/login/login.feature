@login-gui
Feature: Login
As a user I want to be able to login with valid 
credentials and fail to login without them.

@standard(others)_user

Scenario Outline: Login in a way as standard user (check radio "others" )
    Given The user navigates to the login page
    When The user enters credentials "<usernameKey>" and "<passwordKey>"
    Then The DLINKHDD page is displayed
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
    Then The DLINKHDD page is displayed
@only
Scenario: Fail to login as a System Administrator user
    Given The user navigates to the login page
    When The user enters incorrect "CPPSWDINCORRECT" password
    Then The Login page is displayed
    Then The "<errorMessage>" error is displayed


#Scenario: User see login form
#    Given user navigate to DLink login page
#    Then text "Please Select Your Account:", "System Administrator(admin)", "Others :", "Password:" will be visible
#    And user can see the radio buttons for choosing user
#    And user can see the username field
#    And user can see the password field
#    And user can see the button "Login"