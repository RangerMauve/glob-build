var _glob = require("glob");
var fs = require("fs-promise");
var path = require("path");
var par = require("par");
var Promise = require("any-promise");
var dotty = require("dotty");

module.exports = build;

function build(directory, extension, process_file) {
	process_file = process_file || pass_through;
	extension = extension || "*";
	directory = directory || "";
	return get_file_names(directory, extension)
		.then(par(process_files, directory, process_file));
}

function pass_through(content, name) {
	return content;
}

function get_file_names(directory, extension) {
	return glob(path.join(directory, "**/*." + extension));
}

function process_files(directory, process_file, files) {
	var map = {};
	return Promise.all(
		files.map(
			par(load_file, directory, process_file, map)
		)
	).then(function() {
		return map;
	});
}

function load_file(directory, process_file, map, file) {
	var name = get_name(directory, file);
	return fs.readFile(file, "utf8").then(par(build_file, process_file, map, name));
}

function build_file(process_file, map, name, contents) {
	return Promise.resolve(process_file(contents, name))
		.then(function(result) {
			dotty.put(map, name, result);
			return result;
		});
}

function get_name(directory, file_path) {
	var sep = path.sep;
	var match_ending = new RegExp("\\" + sep + "?\\..+$", "i");
	return path
		.relative(directory, file_path)
		.replace(match_ending, "")
		.split(sep)
		.join(".");
}

function glob(pattern) {
	return new Promise(function(resolve, reject) {
		_glob(pattern, function(err, matches) {
			if (err) reject(err);
			else resolve(matches);
		});
	});
}
