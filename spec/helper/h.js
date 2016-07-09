var inferno = require('inferno');

function h(shape, childrenType) {
  return inferno.createBlueprint(shape, childrenType);
}

module.exports = h;
