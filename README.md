glob-build
==========

Globs for files in a directory, processes them all and builds up a nested object

`npm install --save glob-build`

Example
-------

Say you have a directory with a bunch of [mustache](https://www.npmjs.com/package/mustache) templates in a complex directory, and you want an easy way to get to them via a JS api.

The directory might look like

```
example/
	foo.html
	bar/baz.html
```

With this library, you can easily turn that into a JS object that looks like

```javascript
{
	foo: render(data),
	bar: {
		baz: render(data)
	}
}
```

With some simple code:

```javascript
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
```

API
---

### `build([directory], [extension], [builder])`

Takes in a directory, a file extension to match for, and a function for modifying files before they're saved to a tree.

#### arguments

-	[directory] `String`: The directory to crawl through. Uses present working directory by default.
-	[extension] `String`: What file extensions to traget, `*` by default
-	[builder] `Function(contents,name)` A function for building the value for that file in the tree. `contents` is the contents of that file (assumes `utf8`), `name` is a key path for the file in the tree (`looks.like.this`). By default it just sets the value to the contents.

### returns

-	`Promise`: Resolves to the generated tree from the files and the builder.

> Note: this library uses [any-promise](https://www.npmjs.com/package/any-promise), so make sure to have a compatible promise implementation installed.
