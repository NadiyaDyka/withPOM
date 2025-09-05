# PlaywrightExample

This is an example of a Playwright BDD test framework project, tesitng both APIs and GUIs.

# Example website

https://www.saucedemo.com/ for GUI testing.
https://reqres.in for API testing.

# Reasons for doing things the way I did them.

POM model is superior for maintainability. Plus it follows good coding practices for abstracting things out into their separate locations.
Using testIds (aka "data-\*" Ids) is superior to using xpaths because xpaths could change, but the test Id should be stable.
Using .env files is a good way to hide sensitive data from your repo. Repos should NOT have sensitive information pushed to them.
BDD was requested of me at work, so I experimented with it posted it here as a demo solution (no work code, just examples).
API testing is a "must have" in most environments, so I include it here, with minimal extra libraries. Thanks for already having a context Playwright!
According to Stack Overflow, you need to have all the processing of requests in the same file, otherwise the response will be disposed.
If I can find a way to NOT do that, then I will refactor.
Any generated file MUST go into the .gitignore because its standard practice to not commit generated files.

Prettier, ES Lint, and Husky are libraries that help SDETs maintain clean code with propper syntax and styling.

# To setup this project for yourself.

Clone or pull down the zip archive, and unzip it.
Open the root directory in VS Code. Create a new terminal.
Run the following commands:

```
npm install
```

Now, you $hould have all the modules/libraries installed.

# Run test commands

To test the GUI, run the following commands:

```
npm test
pnpm test
pnpm tagged-test "@login-gui"
```

NPM, NPX, or PNPM, whatever you have.

To test the API, run the following commands (TBD):

```
pnpm tagged-test "@login-api"
```

# How I set this up (for future me or you)

```
npm init playwright@latest
npm install @playwright/test
npm install dotenv -D
npm install playwright -D
npm install playwright-bdd -D
npm install winston -D
npm install node-fetch -D
```

With selection options for (npm init playwright@latest):

- Typescript
- "test-scenarios" as test folder
- No Git (setup later)
- Yes, Install playwright browsers.

Copy created project into a repo that you already created on Github or your prefered storage site.
Added folders to organize your project.
Visited "https://playwright.dev/docs/pom" for POM page example.
Visited "https://github.com/apatelia/playwright-with-bdd/blob/main/step-definitions/login.steps.ts" as an example project for getting BDD functionality working right.

# Login Test: login/login.feature made for sausedemo.com

Basic login tests.

- Login as a standard user
- Login as a locked out user

# API tests: login-api/login-api.feature made for reqres.in user

- Login as a standard user via API
- Unable to Login missing the password field

# Added EsList Prettier and Husky

These libraries are added so that a QA team can have their code checked before PR.
