---
id: quick-start
title: Quick Start
slug: /interactors
---

BigTest's Interactors make your UI tests easier to write, faster, and more reliable. You can use them across many different testing frameworks.

By the end of this quick start, you will be testing one of your own apps with Interactors.

If you need help or have questions along the way, please let us know in [the Discord chat](https://discord.gg/r6AvtnU).

## Prerequisites

- [NPM](https://www.npmjs.com/get-npm) or [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [Node](https://nodejs.org/en/download/releases/)
- A web app*

*To follow along with this tutorial, you need an app that uses [Jest](https://jestjs.io/), [Cypress](https://www.cypress.io/), or BigTest. You either can use your own app that you have already made, or you can follow along using our sample app, [BigTest TodoMVC](#todo).

## Installation

First, install `bigtest` in your app:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="npm"
  values={[
    {label: 'NPM', value: 'npm'},
    {label: 'Yarn', value: 'yarn'}
  ]}>
  <TabItem value="npm">

  ```
  $ npm install bigtest --save-dev
  ```

  </TabItem>
  <TabItem value="yarn">
  
  ```
  $ yarn add bigtest --dev
  ```
  
  </TabItem>
</Tabs>

## Import Interactors in your test suite

Interactors can do a lot, but let's keep things simple and start with testing one of the most common user interactions - a button click.

In your codebase, find a test that already has a button click in it.
In that test, import the `Button` interactor from `bigtest`,
and use it to replace the click interaction. Interactors have methods like `click` that mimic user actions.

Click on the tabs below to see some examples within different testing frameworks:

<Tabs
  defaultValue="jest"
  values={[
    {label: 'Jest', value: 'jest'},
    {label: 'Cypress', value: 'cypress'},
    {label: 'BigTest (alpha)', value: 'bigtest'}
  ]}>
  <TabItem value="jest">

  ```jsx
  import React from 'react';
  import { render } from '@testing-library/react';
  import App from './App';

  import { Button } from 'bigtest';

  describe('Interactors with Jest', () => {
    beforeEach(() => render(<App />));

    it('clicks button', async () => {
      await Button('Sign In').click();
      // the rest of your test that was already written
    })
  })
  ```

  </TabItem>
  <TabItem value="cypress">

  ```jsx
  import { Button } from 'bigtest';

  describe('Interactors with Cypress', () => {
    beforeEach(() => cy.visit('/'));

    it('clicks button', () => {
      cy.do(
        Button('Sign In').click();
      );
      // the rest of your test that was already written
    })
  })
  ```

  </TabItem>
  <TabItem value="bigtest">

  ```jsx
  import { Button, Page, test } from 'bigtest';

  export default test('BigTest')
    .step(
      Page.visit('/'),
      Button('Sign In').click())
    .assertion(Button('Log out').exists());
  ```

  </TabItem>
</Tabs>

Make sure to substitute "Sign In" with your own button text.

Now, run your tests! Congratulations, you used your first Interactor.

## Making test assertions

Interactors have methods to help you make test assertions, like checking if a Button is `absent` or if it `exists`.

In this example, we are testing that the "Sign In" button disappears after
a click, and a "Log Out" button appears:

<Tabs
  defaultValue="jest"
  values={[
    {label: 'Jest', value: 'jest'},
    {label: 'Cypress', value: 'cypress'},
    {label: 'BigTest (alpha)', value: 'bigtest'}
  ]}>
  <TabItem value="jest">

  ```jsx
  describe('Interactors with Jest', () => {
    beforeEach(() => render(<App />));

    it('clicks button', async () => {
      await Button('Sign In').click();
      await Button('Sign In').absent();
      await Button('Log Out').exists();
    })
  })
  ```

  </TabItem>
  <TabItem value="cypress">

  ```jsx
  describe('Interactors with Cypress', () => {
    beforeEach(() => cy.visit('/'));

    it('clicks button', () => {
      cy.do(
        Button('Sign In').click()
      );
      cy.expect([
        Button('Sign In').absent(),
        Button('Log Out').exists(),
      ]);
    })
  })
  ```

  </TabItem>
  <TabItem value="bigtest">

  ```jsx
  import { Button, Page, test } from 'bigtest';

  export default test('BigTest')
    .step(
      Page.visit('/'),
      Button('Sign In').click())
    .assertion(Button('Log out').exists());
  ```

  </TabItem>
</Tabs>

Run your tests. Now you are making an assertion with an interactor!

## Next steps

### Continue learning about Interactors

Try using more of the [built-in Interactors](#todo) within your tests,
such as `Link`, `Checkbox`, `TextField`, and more.
Once you are comfortable with those, 
you are ready to [write your own Interactors](#todo).

### Try out more BigTest features

There's more to BigTest than Interactors. BigTest can also run your tests on any _real_ browser! We have built a new integrated platform from the ground up to help you test more with less effort. And yes, it's free and Open Source too! Check it out, and let us know what you think.

### Join the BigTest community

If you want to know more about BigTest or run into any problem with Interactors, you can reach out to us on our Discord channel. We're eager to help you get started and hear your feedback to improve BigTest. [Join us today!](https://discord.gg/r6AvtnU)