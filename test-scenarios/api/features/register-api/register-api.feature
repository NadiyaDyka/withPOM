@register-api
Feature: Register-API
As a user I want to be able to register via the API with valid 
credentials and fail to login without them.

@valid_creds-api
Scenario Outline: Login as a standard user via API
    Given The user sets up a POST register request with "<username>" and "<password>"
    # When The user sends register POST http request
    # Then The user receives valid register Response
Examples: 
| username | password |
| standard_user | secret_sauce |