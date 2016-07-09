const isArray = require('./helpers/is-array');
const isNullOrUndefined = require('./helpers/is-null-or-undefined');
const attrsSVG = require('./attrsSVG');

function constructTemplateChildren(t, children, templates) {
  if (isArray(children)) {
    if (children.length > 1) {
      return t.ArrayExpression(
        children.map(function (child) {
          return constructTemplates(t, child, templates);
        })
      );
    } else {
      return constructTemplates(t, children[0], templates);
    }
  } else {
    return constructTemplates(t, children, templates);
  }
}

function getObjectValue(t, val) {
  let objectValue;

  if (isNullOrUndefined(val)) {
    objectValue = t.identifier('null');
  } else if (val.index !== undefined) {
    objectValue = t.identifier('v' + val.index);
  } else if (typeof val === 'string') {
    objectValue = t.StringLiteral(val);
  } else if (typeof val === 'number') {
    objectValue = t.NumericLiteral(val);
  } else if (typeof val === 'boolean') {
    objectValue = t.BooleanLiteral(val);
  } else {
    objectValue = val;
  }

  return objectValue;
}

function hasHyphenOrColon(attr) {
  return attr.indexOf('-') !== -1 || attr.indexOf(':') !== -1;
}

const svgTags = {
  altGlyph: true,
  altGlyphDef: true,
  altGlyphItem: true,
  animate: true,
  animateColor: true,
  animateMotion: true,
  animateTransform: true,
  circle: true,
  clipPath: true,
  'color-profile': true,
  cursor: true,
  defs: true,
  desc: true,
  ellipse: true,
  feBlend: true,
  feColorMatrix: true,
  feComponentTransfer: true,
  feDiffuseLighting: true,
  feDisplacementMap: true,
  feDistantLight: true,
  feFlood: true,
  feFuncA: true,
  feFuncB: true,
  feFuncG: true,
  feFuncR: true,
  feGaussianBlur: true,
  feImage: true,
  feMerge: true,
  feMergeNode: true,
  feMorphology: true,
  feOffset: true,
  fePointLight: true,
  feSpecularLighting: true,
  feSpotLight: true,
  feTile: true,
  feTurbulence: true,
  filter: true,
  'font-face': true,
  'font-face-format': true,
  'font-face-name': true,
  'font-face-src': true,
  'font-face-uri': true,
  foreignObject: true,
  g: true,
  glyph: true,
  glyphRef: true,
  hkern: true,
  image: true,
  line: true,
  linearGradient: true,
  marker: true,
  mask: true,
  metadata: true,
  'missing-glyph': true,
  mpath: true,
  path: true,
  pattern: true,
  polygon: true,
  polyline: true,
  radialGradient: true,
  rect: true,
  set: true,
  stop: true,
  svg: true,
  switch: true,
  symbol: true,
  text: true,
  textPath: true,
  title: true,
  tref: true,
  tspan: true,
  use: true,
  view: true,
  vkern: true
};

function constructTemplates(t, node, templates) {
  if (isNullOrUndefined(node)) {
    return null;
  }
  const tag = node.tag;

  if (tag) {
    const template = [];
    const values = [];

    if (node.isComponent) {
      template.push(t.ObjectProperty(t.identifier('tag'), createArgs(t, values.length)));
      values.push(tag);
    } else {
      template.push(t.ObjectProperty(t.identifier('tag'), tag));
      if (svgTags[tag.value]) {
        template.push(t.ObjectProperty(t.identifier('isSVG'), t.BooleanLiteral(true)));
      }
    }
    const attrs = node.attrs;
    const events = node.events;
    const hooks = node.hooks;
    const spread = node.spread;
    const spreadKeys = spread && Object.keys(spread);
    const eventsKeys = events && Object.keys(events);
    const hooksKeys = hooks && Object.keys(hooks);
    const children = node.children;
    const childrenItems = children && constructTemplateChildren(t, children, templates);

    if (spreadKeys && spreadKeys.length > 0) {
      if (spread) {
        const combined = Object.assign({}, attrs, events, hooks, (children && {children: childrenItems}) || {});
        const combinedKeys = Object.keys(combined);
        const attrsObject = t.ObjectExpression(combinedKeys.map(key => t.ObjectProperty(t.identifier(key), getObjectValue(t, combined[key]))));
        const attrsSpreadObject = t.ObjectExpression([t.SpreadProperty(attrsObject)].concat(spreadKeys.map(spread => t.SpreadProperty(t.identifier(spread)))));

        template.push(t.ObjectProperty(t.identifier('spread'), createArgs(t, values.length)));
        values.push(attrsSpreadObject);
      }
    } else {
      if (!isNullOrUndefined(attrs)) {
        if (attrs.key) {
          if (getObjectValue(t, attrs.key) === attrs.key) {
            template.push(t.ObjectProperty(t.identifier('key'), createArgs(t, values.length)));
            values.push(getObjectValue(t, attrs.key));
          } else {
            template.push(t.ObjectProperty(t.identifier('key'), getObjectValue(t, attrs.key)));
          }
          delete attrs.key;
        }
        if (attrs.className !== undefined && tag.type === 'StringLiteral') {
          if (getObjectValue(t, attrs.className) === attrs.className) {
            template.push(t.ObjectProperty(t.identifier('className'), createArgs(t, values.length)));
            values.push(getObjectValue(t, attrs.className));
          } else {
            template.push(t.ObjectProperty(t.identifier('className'), getObjectValue(t, attrs.className)));
          }
          delete attrs.className;
        }
        if (attrs.lazy !== undefined) {
          template.push(t.ObjectProperty(t.identifier('lazy'), getObjectValue(t, attrs.lazy)));
          delete attrs.lazy;
        }
        if (!svgTags[tag.value] && attrs['class'] !== undefined && tag.type === 'StringLiteral') {
          if (getObjectValue(t, attrs['class']) === attrs['class']) {
            template.push(t.ObjectProperty(t.identifier('className'), createArgs(t, values.length)));
            values.push(getObjectValue(t, attrs['class']));
          } else {
            template.push(t.ObjectProperty(t.identifier('className'), getObjectValue(t, attrs['class'])));
          }
          delete attrs['class'];
        }
        if (attrs.style !== undefined && tag.type === 'StringLiteral') {
          if (getObjectValue(t, attrs.style) === attrs.style) {
            template.push(t.ObjectProperty(t.identifier('style'), createArgs(t, values.length)));
            values.push(getObjectValue(t, attrs.style));
          } else {
            template.push(t.ObjectProperty(t.identifier('style'), getObjectValue(t, attrs.style)));
          }
          delete attrs.style;
        }
        const attrKeys = Object.keys(attrs);

        if (attrKeys.length > 0) {
          const attrsObject = t.ObjectExpression(attrKeys.map(attrKey => {
            let proposedAttr = attrKey;

            if (node.isComponent === true && attrsSVG[proposedAttr] === false) {
              proposedAttr = attrKey.replace(/([A-Z])/g, function (str, match, index) {
                return index ? '-' + match : match;
              }).toLowerCase();
            }
            return t.ObjectProperty(hasHyphenOrColon(proposedAttr) ? t.StringLiteral(proposedAttr) : t.identifier(proposedAttr), getObjectValue(t, attrs[attrKey]));
          }));

          if (node.staticAttrs === true) {
            template.push(t.ObjectProperty(t.identifier('attrs'), attrsObject));
          } else {
            template.push(t.ObjectProperty(t.identifier('attrs'), createArgs(t, values.length)));
            values.push(attrsObject);
          }
        }
      }
      if (!isNullOrUndefined(events)) {
        if (eventsKeys.length > 0) {
          template.push(t.ObjectProperty(t.identifier('events'), createArgs(t, values.length)));
          values.push(t.ObjectExpression(eventsKeys.map(eventKey => {

            return t.ObjectProperty(t.identifier(eventKey.toLowerCase().replace('-', '')), getObjectValue(t, events[eventKey]));
          })));
        }
      }
      if (!isNullOrUndefined(hooks)) {
        if (hooksKeys.length > 0) {
          template.push(t.ObjectProperty(t.identifier('hooks'), createArgs(t, values.length)));
          values.push(t.ObjectExpression(hooksKeys.map(hookKey => {
            return t.ObjectProperty(
                t.identifier(hookKey[2].toLowerCase() + hookKey.substring(3)
              ), getObjectValue(
              t, hooks[hookKey])
            );
          })));
        }
      }
      if (!isNullOrUndefined(children)) {
        if (childrenItems !== null) {
          template.push(t.ObjectProperty(t.identifier('children'), createArgs(t, values.length)));
          values.push(childrenItems);
        }
      }
    }

    templates[node.id] = t.ObjectExpression(template);
    return t.callExpression(t.identifier('bp' + node.id), values);
  } else {
    if (typeof node === 'string') {
      return t.StringLiteral(node);
    } else if (typeof node === 'number') {
      return t.NumericLiteral(node);
    } else if (typeof node === 'boolean') {
      return t.BooleanLiteral(node);
    } else {
      return node;
    }
  }
}

function createArgs(t, index) {
  return t.ObjectExpression([t.ObjectProperty(t.identifier('arg'), t.NumericLiteral(index))]);
}

module.exports = constructTemplates;
