import { describe, it } from 'mocha';
import * as expect from 'expect'
import { JSDOM } from 'jsdom';

import { interactor, setDefaultOptions } from '../src/index';

process.on('unhandledRejection', () => {
  // do nothing
});

const Link = interactor({
  name: 'link',
  selector: 'a',
  defaultLocator: (element) => element.textContent || "",
  actions: {
    click: (element) => { element.click() }
  }
});

const Header = interactor({
  name: 'header',
  selector: 'h1,h2,h3,h4,h5,h6',
  defaultLocator: (element) => element.textContent || ""
});

const Div = interactor({
  name: 'div',
  selector: 'div',
  defaultLocator: (element) => element.id || ""
});

function dom(html: string) {
  let jsdom = new JSDOM(`<!doctype html><html><body>${html}</body></html>`, { runScripts: "dangerously" });
  setDefaultOptions({
    document: jsdom.window.document,
    timeout: 20,
  });
}

describe('@bigtest/interactor', () => {
  describe('.exists', () => {
    it('can determine whether an element exists based on the interactor', async () => {
      dom(`
        <p><a href="/foobar">Foo Bar</a></p>
      `);

      await expect(Link('Foo Bar').exists()).resolves.toEqual(true);
      await expect(Link('Blah').exists()).rejects.toHaveProperty('message', 'link "Blah" does not exist');
    });

    it('can wait for condition to become true', async () => {
      dom(`
        <p id="foo"></p>
        <script>
          setTimeout(() => {
            foo.innerHTML = '<a href="/foobar">Foo Bar</a>';
          }, 5);
        </script>
      `);

      await expect(Link('Foo Bar').exists()).resolves.toEqual(true);
    });
  });

  describe('.absent', () => {
    it('can determine whether an element exists based on the interactor', async () => {
      dom(`
        <p><a href="/foobar">Foo Bar</a></p>
      `);

      await expect(Link('Blah').absent()).resolves.toEqual(true);
      await expect(Link('Foo Bar').absent()).rejects.toHaveProperty('message', 'link "Foo Bar" exists but should not');
    });

    it('can wait for condition to become true', async () => {
      dom(`
        <p id="foo"><a href="/foobar">Foo Bar</a></p>
        <script>
          setTimeout(() => {
            foo.innerHTML = '';
          }, 5);
        </script>
      `);

      await expect(Link('Foo Bar').absent()).resolves.toEqual(true);
    });
  });

  describe('.find', () => {
    it('can find an interactor with the scope of another interactor', async () => {
      dom(`
        <div id="foo">
          <a href="/foo">Foo</a>
        </div>
        <div id="bar">
          <a href="/Bar">Bar</a>
        </div>
      `);

      await expect(Div("foo").find(Link("Foo")).exists()).resolves.toEqual(true);
      await expect(Div("bar").find(Link("Bar")).exists()).resolves.toEqual(true);

      await expect(Div("foo").find(Link("Bar")).exists()).rejects.toHaveProperty('message', 'link "Bar" within div "foo" does not exist');
      await expect(Div("bar").find(Link("Foo")).exists()).rejects.toHaveProperty('message', 'link "Foo" within div "bar" does not exist');
    });

    it('is rejected if the parent interactor cannot be found', async () => {
      dom(`
        <div id="foo">
          <a href="/foo">Foo</a>
        </div>
      `);

      await expect(Div("blah").find(Link("Foo")).exists()).rejects.toHaveProperty('message', 'div "blah" does not exist');
    });
  });

  describe('actions', () => {
    it('can use action to interact with element', async () => {
      dom(`
        <a id="foo" href="/foobar">Foo Bar</a>
        <div id="target"></div>
        <script>
          foo.onclick = () => {
            target.innerHTML = '<h1>Hello!</h1>';
          }
        </script>
      `);

      await Link('Foo Bar').click();
      await expect(Header('Hello!').exists()).resolves.toEqual(true);
    });

    it('works on scoped interactor', async () => {
      dom(`
        <div id="foo"><a href="/foobar">Foo Bar</a></div>
        <div id="target"></div>
        <script>
          foo.onclick = () => {
            target.innerHTML = '<h1>Hello!</h1>';
          }
        </script>
      `);

      await Div("foo").find(Link('Foo Bar')).click();
      await expect(Header('Hello!').exists()).resolves.toEqual(true);
    });
  });
})