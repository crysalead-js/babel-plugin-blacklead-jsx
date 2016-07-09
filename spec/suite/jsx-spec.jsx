var infernoServer = require('inferno-server');
var h = require('../helper/h');
var toHtml = function(vdom) {
  var html = infernoServer.renderToString(vdom);
  return html.replace(/<!---->/g, '').replace(/<!--!-->/g, '');
}

describe("JSX", function() {

  it("creates a simple tag", function() {

    var node = <div>test</div>;
    expect(toHtml(node)).toBe('<div>test</div>');

  });

  it("binds text variable", function() {

    var text = 'Hello World';
    var node = <div>{text}</div>;
    expect(toHtml(node)).toBe('<div>Hello World</div>');

  });

  it("binds array variable", function() {

    var text = ['Hello', 'World'];
    var node = <div>{text}</div>;
    expect(toHtml(node)).toBe('<div>HelloWorld</div>');

  });

  it("binds expressions", function() {

    var text = 'Hello';
    var node = <div>{text + ' World'}</div>;
    expect(toHtml(node)).toBe('<div>Hello World</div>');

  });

  it("extracts attrs", function() {

    var node = <div xmlns="http://www.w3.org/2000/svg" dir="ltr"></div>;
    expect(node.attrs.dir).toBe('ltr');

  });

  // it("camelizes attrs", function() {

  //   var node = <div my-attr="hello"></div>;
  //   expect(node.attrs.myAttr).toBe('hello');

  // });

  // it("extracts attrsNS", function() {

  //   var node = (
  //     <svg xmlns:my-link="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"></svg>
  //   );
  //   expect(node.attrsNS.myLink).toBe('http://www.w3.org/1999/xlink');

  // });

  // it("camelizes attrsNS", function() {

  //   var node = (
  //     <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"></svg>
  //   );
  //   expect(node.attrsNS.xlink).toBe('http://www.w3.org/1999/xlink');

  // });

  // it("extracts data", function() {

  //   var node = <div data-value="hello"></div>;
  //   expect(node.data.value).toBe('hello');

  // });

  // it("camelizes data", function() {

  //   var node = <div data-my-value="hello"></div>;
  //   console.log(node);
  //   expect(node.data.myValue).toBe('hello');

  // });

  it("extracts events", function() {

    var node = <div onclick="alert('hello world')">test</div>;

    expect(node.events.onclick).toBe("alert('hello world')");

  });

  // it("extracts delegated events", function() {

  //   var doSomething = function() {};
  //   var node = <div on-click={doSomething}>test</div>;

  //   expect(node.events.onclick).toBe(doSomething);

  // });

  // it("supports this for delegated events", function() {

  //   this.doSomething = function() {};
  //   var node = <div on-click={this.doSomething}>test</div>;

  //   expect(node.events.onclick).toBe(this.doSomething);

  // });

  // it("extracts multiple delegated events", function() {

  //   var onClick = function() {};
  //   var onMouseOver = function() {};
  //   var node = <div on-click={onClick} on-mouseover={onMouseOver}>test</div>;

  //   expect(node.events.onclick).toBe(onClick);
  //   expect(node.events.onmouseover).toBe(onMouseOver);

  // });

  // it("extracts class hash", function() {

  //   var truthy = true;
  //   var node = <div class={{
  //     foo: truthy,
  //     bar: false,
  //     baz: true
  //   }}>Hello World</div>;

  //   expect(toHtml(node)).toBe('<div class="foo baz">Hello World</div>');

  // });

  // it("extracts style hash", function() {

  //   var fontWeight = "bold";
  //   var node = <span style={{
  //       border: '1px solid #bada55',
  //       color: '#c0ffee',
  //       fontWeight: fontWeight
  //     }}>Hello World</span>;

  //   expect(toHtml(node)).toBe('<span style="border:1px solid #bada55;color:#c0ffee;fontWeight:bold">Hello World</span>');

  // });

  it("manages children", function() {

    var node = (
      <div>text 1
        <div>first</div>
        <ul>
          <li>list item 1</li>
          <li>list item 2</li>
        </ul>
        text 2
      </div>
    );

    expect(toHtml(node)).toBe('<div>text 1<div>first</div><ul><li>list item 1</li><li>list item 2</li></ul>text 2</div>');

  });

  it("manages svg", function() {

    var node = (
      <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
        <rect height="100" style="stroke:#ff0000; fill: #0000ff" width="100" x="10" y="10"/>
      </svg>
    );

    expect(toHtml(node)).toBe('<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><rect style="stroke:#ff0000; fill: #0000ff" height="100" width="100" x="10" y="10"></rect></svg>');

  });

  // it("handles function as tag name", function() {

  //   var Button = function() {};

  //   var node = (
  //     <Button x="100">
  //       <span></span>
  //     </Button>
  //   );

  //   expect(node.tagName).toBe(Button);
  //   expect(node.children[0].tagName).toBe('span');

  // });

  // it("handles namespaced tag name", function() {

  //   var button = {
  //     large: function() {}
  //   };

  //   var node = (
  //     <button.large x="100">
  //       <span></span>
  //     </button.large>
  //   );

  //   expect(node.tagName).toBe(button.large);
  //   expect(node.children[0].tagName).toBe('span');

  // });

  // it("handles this in tag name", function() {

  //   this.Button = function() {};

  //   var node = (<this.Button>Hello World</this.Button>);
  //   expect(node.tagName).toBe(this.Button);

  // });

  // it("should handle self closing tags", function() {

  //   var node = <span class="button"/>;

  //   expect(node.tagName).toBe('span');
  //   expect(node.attrs.class).toBe('button');

  // });

  // it("handles boolean attributes", function() {

  //   var node = <input checked name="ok"/>;

  //   expect(node.tagName).toBe('input');
  //   expect(node.attrs.checked).toBe(true);

  // });

  it("handles empty placeholders", function() {

    var node = <span>{}</span>;

    expect(toHtml(node)).toBe('<span></span>');

  });

  it("handles a child in placeholders", function() {

    var node = <div>{ <span></span> }</div>;

    expect(toHtml(node)).toBe('<div><span></span></div>');

  });

  it("handles children in placeholders", function() {

    var node = <div>{ [<span></span>, <ul></ul>] }</div>;

    expect(toHtml(node)).toBe('<div><span></span><ul></ul></div>');

  });

  it("supports if", function() {

    function template(show) {
      return (
        <div>
          <If condition={ show }>
            hello world
          </If>
        </div>
      );
    }

    expect(toHtml(template(true))).toBe('<div>hello world</div>');
    expect(toHtml(template(false))).toBe('<div></div>');

  });

  it("supports foreach", function() {

    function template(items) {
      return (
        <div>
          <For each="item" index="key" of={ items }>
            { key }{ item }
          </For>
        </div>
      );
    }

    expect(toHtml(template(['a', 'b', 'c']))).toBe('<div>0a1b2c</div>');
    expect(toHtml(template([]))).toBe('<div></div>');

  });

  it("supports choose", function() {

    function template(test1, test2) {
      return (
        <div>
          <Choose>
            <When condition={ test1 }>
              <span>IfBlock</span>
            </When>
            <When condition={ test2 }>
              <span>ElseIfBlock</span>
            </When>
            <Otherwise>
              <span>ElseBlock</span>
            </Otherwise>
          </Choose>

          <Choose>
            <When condition={true}>
              <span>Block</span>
            </When>
          </Choose>
        </div>
      );
    }

    expect(toHtml(template(true, false))).toBe('<div><span>IfBlock</span><span>Block</span></div>');
    expect(toHtml(template(false, true))).toBe('<div><span>ElseIfBlock</span><span>Block</span></div>');
    expect(toHtml(template(false, false))).toBe('<div><span>ElseBlock</span><span>Block</span></div>');

  });

  it("supports foreach", function() {

    function template(items) {
      return (
        <div>
          <For each="item" index="key" of={ items }>
            { key }{ item }
          </For>
        </div>
      );
    }

    expect(toHtml(template(['a', 'b', 'c']))).toBe('<div>0a1b2c</div>');
    expect(toHtml(template([]))).toBe('<div></div>');

  });

  it("supports foreach on objects", function() {

    function template(items) {
      return (
        <div>
          <For each="key" of={ Object.keys(items) }>
            { key }{ items[key] }
          </For>
        </div>
      );
    }

    expect(toHtml(template({a: 'a', b: 'b', c: 'c'}))).toBe('<div>aabbcc</div>');
    expect(toHtml(template({}))).toBe('<div></div>');

  });

  it("supports nested blocks", function() {

    function template(items1, items2) {
      return (
        <div>
          <For each="item1" index="key1" of={ items1 }>
            <For each="item2" index="key2" of={ items2 }>
              { key1 }{ item1 }:{ key2 }{ item2 }
            </For>
          </For>
        </div>
      );
    }

    expect(toHtml(template(['a', 'b', 'c'], ['d', 'e', 'f']))).toBe('<div>0a:0d0a:1e0a:2f1b:0d1b:1e1b:2f2c:0d2c:1e2c:2f</div>');
    expect(toHtml(template([],['d', 'e', 'f']))).toBe('<div></div>');
    expect(toHtml(template(['a', 'b', 'c'],[]))).toBe('<div></div>');
    expect(toHtml(template([],[]))).toBe('<div></div>');

  });

  it("supports overriding", function() {

    function template(items1, items2) {
      return (
        <div>
          <For each="item" index="key" of={ items1 }>
            <For each="item" index="key" of={ items2 }>
              { key }{ item }
            </For>
          </For>
        </div>
      );
    }

    expect(toHtml(template(['a', 'b', 'c'], ['d', 'e', 'f']))).toBe('<div>0d1e2f0d1e2f0d1e2f</div>');
    expect(toHtml(template([],['d', 'e', 'f']))).toBe('<div></div>');
    expect(toHtml(template(['a', 'b', 'c'],[]))).toBe('<div></div>');
    expect(toHtml(template([],[]))).toBe('<div></div>');

  });

  it("propagates the self context", function() {

    function template(items) {
      this.message = 'HelloWorld';
      return (<div>{ this.message }</div>);
    }

    expect(toHtml(template())).toBe('<div>HelloWorld</div>');

  });

  it("propagates the self context in control structures", function() {

    function template(items) {
      this.message = 'HelloWorld';
      return (
        <div>
          <For each="item" of={ items }>
            { this.message }
          </For>
        </div>
      );
    }

    expect(toHtml(template([1, 1]))).toBe('<div>HelloWorldHelloWorld</div>');

  });

});
