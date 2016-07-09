# babel-plugin-blacklead-jsx

[![Build Status](https://travis-ci.org/crysalead-js/babel-plugin-blacklead-jsx.svg?branch=master)](https://travis-ci.org/crysalead-js/babel-plugin-blacklead-jsx)

This plugin transforms JSX code in your projects to work with the [Inferno](https://github.com/trueadm/inferno) virtual dom library. It also allows control statements (i.e. <if>, <for> and <choose>) out of the box.

*Note! This plugin has been built for use in Babel 6.x environments.*

## Install

### Node.js

```
npm install babel-plugin-blacklead-jsx --save
```

And configure your `.babelrc` file like the following:

```
{
  "plugins": ["blacklead-jsx"]
}
```

## Syntax of Control Statements

### If

```javascript
<If condition={ true }>
  <span>IfBlock</span>
</If>
```

### For

On an array of objects:
```javascript
<For each="item" index="key" of={ items }>
  <span key={ item.id }>{ item.title } with key { key }</span>
</For>
```

On an object of objects:
```javascript
<For each="key" of={ Object.keys(items) }>
  <span key={ items[key].id }>{ items[key].title }</span>
</For>
```

### Choose

```javascript
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
```

## Acknowledgment

This repo is mainly a fork of https://github.com/trueadm/babel-plugin-inferno
