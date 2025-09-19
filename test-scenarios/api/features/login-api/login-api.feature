@login-api
Feature: Login-Api
As a user I want to be able to login via the API with valid 
credentials and fail to login without them.

#@valid_creds-api @login-api
#Scenario Outline: Login as a standard user via API
#    Given The user sets up a POST login request with "<email>" and "<password>"
#    When The user sends login POST http request
#    Then The user receives valid login Response
#Examples: 
#| email | password |
#| eve.holt@reqres.in | pistol |

#@invalid_creds-api @login-api
#Scenario Outline: Unable to Login missing the password field
#    Given The user sets up a POST login request with "<email>" and "<password>"
#    When The user sends a login POST http request missing the password field
#    Then The user receives "<error>" error login response
#Examples: 
#| email | password | error | 
#| eve.holt@reqres.in | pistol | Missing password |