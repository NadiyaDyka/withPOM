@login-gui
Feature: Login
As a user I want to be able to login with valid 
credentials and fail to login without them.

@standard(others)_user
@only
Scenario Outline: Login in a way as standard user (check radio "others" )
    Given The user navigates to the login page
    When The user enters "<username>" and "<password>"
    Then The DLINKHDD page is displayed
Examples: 
    | username | password   |
    | CPSA     | CPPSWD     |
    | CPUSER   | CPUSERPSWD | 
    

@standard(others)_user
@only
Scenario: Fail login for standard user (check radio "others" )
    Given The user navigates to the login page
    When The user enters incorrect credentials 
    Then The Login page is displayed

@admin_user

Scenario: Login as a System Administrator user
    Given The user navigates to the login page
    When The user enters "<password>" only
    Then The DLINKHDD page is displayed
    #Then The "<errorMessage>" error is displayed

Scenario: Fail to login as a System Administrator user
    Given The user navigates to the login page
    When The user enters incorrect password only
    Then The Login page is displayed
    And The "<errorMessage>" error is displayed


#Scenario: User see login form
#    Given user navigate to DLink login page
#    Then text "Please Select Your Account:", "System Administrator(admin)", "Others :", "Password:" will be visible
#    And user can see the radio buttons for choosing user
#    And user can see the username field
#    And user can see the password field
#    And user can see the button "Login"