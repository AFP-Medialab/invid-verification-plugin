var Suite = require('./suite');

var a;

var suite = new Suite('eles.is()', {
  setup: function( cytoscape ){
    var cy = cytoscape({ elements: require('./graphs/gal') });

    a = cy.nodes();

    return cy;
  }
});

suite
  .add( function( cy ) {
    a.is('node');
  })
;

module.exports = suite;
