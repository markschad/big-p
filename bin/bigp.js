var P = require("../dist")._P;
var path = require("path");
var glob = require("glob");

const load = file => require(path.resolve(file));

// Load all tests.
for (let i = 2; i < process.argv.length; i++) {
	const files = glob.sync(pattern = process.argv[i]);
	files.forEach(load);
}

P.test();
