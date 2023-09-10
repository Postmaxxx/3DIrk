const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
global.document = jsdom.window.document;
global.window = jsdom.window;


global.navigator = {
    userAgent: 'node.js',
};

// Define a mock File constructor
global.File = class File extends window.Blob {
    constructor(data, name, options) {
        super(data, options);
        this.name = name;
    }
};