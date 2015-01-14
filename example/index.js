var globBuild = require("../").build;
var mustache = require("mustache");

globBuild(__dirname, "html", builder).then(function(templates) {
	console.log("Result:", templates);
	console.log(templates.foo({
		place: "World"
	}));
	console.log(templates.bar.baz({
		place: "World"
	}));
}).catch(function(err) {
	console.log("Error:", err, err.stack);
})

function builder(contents, name) {
	// Name doesn't matter for this
	return function(data) {
		return mustache.render(contents, data);
	}
}
