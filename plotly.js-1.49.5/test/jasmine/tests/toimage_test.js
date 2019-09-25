var Plotly = require('@lib');
var Lib = require('@src/lib');

var d3 = require('d3');
var createGraphDiv = require('../assets/create_graph_div');
var destroyGraphDiv = require('../assets/destroy_graph_div');
var failTest = require('../assets/fail_test');
var subplotMock = require('@mocks/multiple_subplots.json');

var FORMATS = ['png', 'jpeg', 'webp', 'svg'];

describe('Plotly.toImage', function() {
    'use strict';

    var gd;

    beforeEach(function() {
        gd = createGraphDiv();
    });

    afterEach(destroyGraphDiv);

    function createImage(url) {
        return new Promise(function(resolve, reject) {
            var img = document.createElement('img');
            img.src = url;
            img.onload = function() { return resolve(img); };
            img.onerror = function() { return reject('error during createImage'); };
        });
    }

    function assertSize(url, width, height) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.onload = function() {
                expect(img.width).toBe(width, 'image width');
                expect(img.height).toBe(height, 'image height');
                resolve(url);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    it('should be attached to Plotly', function() {
        expect(Plotly.toImage).toBeDefined();
    });

    it('should return a promise', function(done) {
        function isPromise(x) {
            return !!x.then && typeof x.then === 'function';
        }

        var returnValue = Plotly.plot(gd, subplotMock.data, subplotMock.layout)
               .then(Plotly.toImage);

        expect(isPromise(returnValue)).toBe(true);

        returnValue.then(done);
    });

    it('should throw error with unsupported file type', function(done) {
        var fig = Lib.extendDeep({}, subplotMock);

        Plotly.plot(gd, fig.data, fig.layout)
        .then(function(gd) {
            expect(function() { Plotly.toImage(gd, {format: 'x'}); })
                .toThrow(new Error('Image format is not jpeg, png, svg or webp.'));
        })
        .catch(failTest)
        .then(done);
    });

    it('should throw error with height and/or width < 1', function(done) {
        var fig = Lib.extendDeep({}, subplotMock);

        Plotly.plot(gd, fig.data, fig.layout)
        .then(function() {
            expect(function() { Plotly.toImage(gd, {height: 0.5}); })
                .toThrow(new Error('Height and width should be pixel values.'));
        })
        .then(function() {
            expect(function() { Plotly.toImage(gd, {width: 0.5}); })
                .toThrow(new Error('Height and width should be pixel values.'));
        })
        .catch(failTest)
        .then(done);
    });

    it('should create img with proper height and width', function(done) {
        var fig = Lib.extendDeep({}, subplotMock);

        // specify height and width
        fig.layout.height = 600;
        fig.layout.width = 700;

        Plotly.plot(gd, fig.data, fig.layout).then(function(gd) {
            expect(gd.layout.height).toBe(600);
            expect(gd.layout.width).toBe(700);
            return Plotly.toImage(gd);
        })
        .then(createImage)
        .then(function(img) {
            expect(img.height).toBe(600);
            expect(img.width).toBe(700);

            return Plotly.toImage(gd, {height: 400, width: 400});
        })
        .then(createImage)
        .then(function(img) {
            expect(img.height).toBe(400);
            expect(img.width).toBe(400);
        })
        .catch(failTest)
        .then(done);
    });

    it('should use width/height of graph div when width/height are set to *null*', function(done) {
        var fig = Lib.extendDeep({}, subplotMock);

        gd.style.width = '832px';
        gd.style.height = '502px';

        Plotly.plot(gd, fig.data, fig.layout).then(function() {
            expect(gd.layout.width).toBe(undefined, 'user layout width');
            expect(gd.layout.height).toBe(undefined, 'user layout height');
            expect(gd._fullLayout.width).toBe(832, 'full layout width');
            expect(gd._fullLayout.height).toBe(502, 'full layout height');
        })
        .then(function() { return Plotly.toImage(gd, {width: null, height: null}); })
        .then(function(url) { return assertSize(url, 832, 502); })
        .catch(failTest)
        .then(done);
    });

    it('should create proper file type', function(done) {
        var fig = Lib.extendDeep({}, subplotMock);

        Plotly.plot(gd, fig.data, fig.layout)
        .then(function() { return Plotly.toImage(gd, {format: 'png'}); })
        .then(function(url) { return assertSize(url, 700, 450); })
        .then(function(url) {
            expect(url.split('png')[0]).toBe('data:image/');
        })
        .then(function() { return Plotly.toImage(gd, {format: 'jpeg'}); })
        .then(function(url) { return assertSize(url, 700, 450); })
        .then(function(url) {
            expect(url.split('jpeg')[0]).toBe('data:image/');
        })
        .then(function() { return Plotly.toImage(gd, {format: 'svg'}); })
        .then(function(url) { return assertSize(url, 700, 450); })
        .then(function(url) {
            expect(url.split('svg')[0]).toBe('data:image/');
        })
        .then(function() { return Plotly.toImage(gd, {format: 'webp'}); })
        .then(function(url) { return assertSize(url, 700, 450); })
        .then(function(url) {
            expect(url.split('webp')[0]).toBe('data:image/');
        })
        .catch(failTest)
        .then(done);
    });

    it('should strip *data:image* prefix when *imageDataOnly* is turned on', function(done) {
        var fig = Lib.extendDeep({}, subplotMock);

        Plotly.plot(gd, fig.data, fig.layout)
        .then(function() { return Plotly.toImage(gd, {format: 'png', imageDataOnly: true}); })
        .then(function(d) {
            expect(d.indexOf('data:image/')).toBe(-1);
            expect(d.length).toBeWithin(52500, 7500, 'png image length');
        })
        .then(function() { return Plotly.toImage(gd, {format: 'jpeg', imageDataOnly: true}); })
        .then(function(d) {
            expect(d.indexOf('data:image/')).toBe(-1);
            expect(d.length).toBeWithin(43251, 5e3, 'jpeg image length');
        })
        .then(function() { return Plotly.toImage(gd, {format: 'svg', imageDataOnly: true}); })
        .then(function(d) {
            expect(d.indexOf('data:image/')).toBe(-1);
            expect(d.length).toBeWithin(32062, 1e3, 'svg image length');
        })
        .then(function() { return Plotly.toImage(gd, {format: 'webp', imageDataOnly: true}); })
        .then(function(d) {
            expect(d.indexOf('data:image/')).toBe(-1);
            expect(d.length).toBeWithin(15831, 1e3, 'webp image length');
        })
        .catch(failTest)
        .then(done);
    });

    FORMATS.forEach(function(f) {
        it('should respond to *scale* option ( format ' + f + ')', function(done) {
            var fig = Lib.extendDeep({}, subplotMock);

            Plotly.plot(gd, fig.data, fig.layout)
            .then(function() { return Plotly.toImage(gd, {format: f, scale: 2}); })
            .then(function(url) { return assertSize(url, 1400, 900); })
            .then(function() { return Plotly.toImage(gd, {format: f, scale: 0.5}); })
            .then(function(url) { return assertSize(url, 350, 225); })
            .catch(failTest)
            .then(done);
        });
    });

    it('should accept data/layout/config figure object as input', function(done) {
        var fig = Lib.extendDeep({}, subplotMock);

        Plotly.toImage(fig)
        .then(createImage)
        .then(function(img) {
            expect(img.width).toBe(700);
            expect(img.height).toBe(450);
        })
        .catch(failTest)
        .then(done);
    });

    it('should accept graph div id as input', function(done) {
        var fig = Lib.extendDeep({}, subplotMock);

        Plotly.plot(gd, fig)
        .then(function() { return Plotly.toImage('graph'); })
        .then(createImage)
        .then(function(img) {
            expect(img.width).toBe(700);
            expect(img.height).toBe(450);
        })
        .catch(failTest)
        .then(done);
    });

    it('should work on pages with <base>', function(done) {
        var parser = new DOMParser();

        var base = d3.select('body')
            .append('base')
            .attr('href', 'https://plot.ly');

        Plotly.plot(gd, [{ y: [1, 2, 1] }])
        .then(function() {
            return Plotly.toImage(gd, {format: 'svg', imageDataOnly: true});
        })
        .then(function(svg) {
            var svgDOM = parser.parseFromString(svg, 'image/svg+xml');
            var gSubplot = svgDOM.getElementsByClassName('plot')[0];
            var clipPath = gSubplot.getAttribute('clip-path');
            var len = clipPath.length;

            var head = clipPath.substr(0, 5);
            var tail = clipPath.substr(len - 8, len);
            expect(head).toBe('url(\'', 'subplot clipPath head');
            expect(tail).toBe('xyplot\')', 'subplot clipPath tail');

            var middle = clipPath.substr(4, 10);
            expect(middle.length).toBe(10, 'subplot clipPath uid length');
            expect(middle.indexOf('http://')).toBe(-1, 'no <base> URL in subplot clipPath!');
            expect(middle.indexOf('https://')).toBe(-1, 'no <base> URL in subplot clipPath!');
        })
        .catch(failTest)
        .then(function() {
            base.remove();
            done();
        });
    });
});
