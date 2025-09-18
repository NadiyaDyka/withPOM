@login-gui
Feature: Management
    As a user I want to be able to manage settings for my Dlinkhdd.

    Background:
        Given The user is logged in as Admin
        And The user opens Management menu
        And The user opens Application Management menu
        And The user opens the UPnP AV Server tab
        And The user gets the Refresh All button is visible and enabled # to make sure that the page is loaded and the preview process is finished

    @only
    Scenario: Admin refreshes the media library in UPnP AV Server
        When The user clicks Refresh All button
        Then The user see the progress bar
        And The user waits for completion
        And The user gets finish popoup visible
        And The user close the popup
        And The user gets the Refresh All button is visible and enabled


    Scenario: Admin can see the completion of the previews refreshing after leaving the process midway and returning before it finished
        When The user clicks Refresh All button
        And The user see the progress bar
        And The user leaves to another tab
        And The user opens the UPnP AV Server tab
        Then The user see the progress bar
        And The user waits for completion
        And The user gets finish popoup visible
        And The user close the popup
        And The user gets the Refresh All button is visible and enabled

    Scenario: Admin can see the completion of the previews refreshing after leaving finished process before clicking OK on popup and returning
        When The user clicks Refresh All button
        And The user see the progress bar
        And The user waits for completion
        And The user gets finish popoup visible
        And The user is logged in as Admin
        And The user opens Management menu
        And The user opens Application Management menu
        And The user opens the UPnP AV Server tab
        Then The user see the progress bar
        And the user waits for completion
        And The user gets finish popoup visible
        And The user close the popup
        And The user gets the Refresh All button is visible and enabled
