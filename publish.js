load(JSDOC.opt.t + '/json2.js');
//some usability filters {would be better if these were a part of jstoolkit itself)
function hasNoParent($) {return ($.memberOf == '')}
function isaFile($) {return ($.is('FILE'))}
function isaClass($) {return ($.is('CONSTRUCTOR') || $.isNamespace)}
function makeSortby(attribute) {
	return function(a, b) {
		if (a[attribute] != undefined && b[attribute] != undefined) {
			a = a[attribute].toLowerCase();
			b = b[attribute].toLowerCase();
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		}
	}
}
/**
 * Iterate over an array and push each element on another array after a function has been applied to it
 *
 * @param {Array} targetArray The target array
 * @param {Array{ orgArray The array with the orginal elements
 * @param {Function} a callback/function with the element as parameter
 * @private
 * @returns void 
 */
function Each(targetArray, orgArray, formatFunction) {
	if (orgArray && orgArray.length > 0 ) {
		for (var i = 0; i < orgArray.length; i++) {
			targetArray.push(formatFunction(orgArray[i]));
		}
	}
}

/*
 * Simple function to set only the properties that we are interested in
 * 
 * @param {object} symbol The symbol that will be exported
 * @private
 * @returns {object}	The symbol's interesting properties
 */
function formatExample(example) {

	return example.desc || "";
}
/*
 * Simple function to set only the properties that we are interested in
 * 
 * @param {object} symbol The symbol that will be exported
 * @private
 * @returns {object}	The symbol's interesting properties
 */
function formatParameter(symbol) {
	var set = { 'name': symbol.name,
				'type': symbol.type,
				'description': symbol.desc,
				'default': symbol.defaultValue,
				'optional': symbol.isOptional,
				'nullable': '',
				'examples' : [],
		};

	return set;
}

/*
 * Simple function to set only the properties that we are interested in
 * 
 * @param {object} symbol The symbol that will be exported
 * @private
 * @returns {object}	The symbol's interesting properties
 */
function formatEvent(symbol){
	var set = { 'name': symbol.name,
				'description': symbol.desc,
				'parameters': [],
				'examples' : [],
	};
	Each(set.parameters, symbol.parameters, formatParameter);
	Each(set.examples, symbol.example, formatExample);

	return set;
}

/*
 * Simple function to set only the properties that we are interested in
 * 
 * @param {object} symbol The symbol that will be exported
 * @private
 * @returns {object}	The symbol's interesting properties
 */

function formatField(symbol){
	var set = { 'name': symbol.name,
				'type': symbol.type,
				'description': symbol.desc,
				'default': symbol.defaultValue,
				'examples' : [],
	};
	Each(set.examples, symbol.example, formatExample);

	return set;
}
/*
 * Simple function to format the symbol' extension
 * 
 * @param {object} symbol The symbol that will be exported
 * @private
 * @returns {string}	The symbol's name
 */

function formatExtend(symbol) {

	return symbol.alias;
}
/*
 * Simple function to set only the properties that we are interested in
 * 
 * @param {object} symbol The symbol that will be exported
 * @private
 * @returns {object}	The symbol's interesting properties
 */

function formatFunction(symbol) {
	var set = { 'name': symbol.name,
				'access': '',
				'virtual': false,
				'returns': {'type': [], 'description': ''},
				'description': symbol.desc,
				'parameters': [],
				'examples' : [],
	};
	if (symbol.returns && symbol.returns.length > 0 ) {
		for (var i = 0; i < symbol.returns.length; i++) {
			(function(ret, se){
				se.returns.description += ret.desc + '\n\n';
				se.returns.type.push(ret.type);
			})(symbol.returns[i], set);
		}
	}
	Each(set.parameters, symbol.params, formatParameter);
	Each(set.examples, symbol.example, formatExample);

	return set;
}

/*
 * Simple function to set only the properties that we are interested in
 * 
 * @param {object} symbol The symbol that will be exported
 * @private
 * @returns {object}	The symbol's interesting properties
 */
function formatConstructor(symbol) {
	var set = { 'name': symbol.name,
				'description': symbol.desc,
				'examples' : [],
				'parameters' : [],
	};
	Each(set.parameters, symbol.params, formatParameter);
	Each(set.examples, symbol.example, formatExample);

	return set;
}

/*
 * This 'formats' a Class (including it's constructor, parents, properties, methods, events and examples'
 * 
 * @param	{object} symbol Class symbol 
 * @private
 * @returns {object} The class symbol's interesting properties
 */
function formatClass(symbol) {
	var set = {
			'name': 			symbol.alias,
			'description':	symbol.desc,
			'access': '',
			'virtual': false,
			'constructor': {},
			'extends': [],
			'fires': [],
			'functions': [],
			'fields': [],
			'examples': []
	};
	if (!symbol.isBuiltin() && (symbol.isNamespace || symbol.is('CONSTRUCTOR'))) {
		set.constructor = formatConstructor(symbol);
	}
	Each(set['extends'], symbol.augements, formatExtend);
	Each(set.functions, symbol.getMethods(), formatFunction);
	Each(set.fields, symbol.properties, formatField);
	Each(set.fires, symbol.getEvents(), formatEvent);
	Each(set.examples, symbol.example, formatExample);

	return set;
}
/**
 * This is the function that jstoolkit calls when the data is collected and neends to be exported to the template
 *
 * @param	{object} symbolset The whole datastructure (You can inspect it with the commandline option '-Z'
 */
function publish(symbolSet) {
	try {
		publish.conf = {
			templateName: 'murakami',
			templateVersion: '0.0.1',
			templateLink: 'https://github.com/verpeteren/murakami/',
			fileName: 'jsdoc.js'
		};
		var root = {'classes': []};
		var fileName = (JSDOC.opt.D.fileName) ? JSDOC.opt.D.fileName : publish.conf.fileName;
		var classes = symbolSet.toArray().filter(isaClass).sort(makeSortby('alias'));
		for (var i = 0, l = classes.length; i < l; i++) {
			root["classes"].push(formatClass(classes[i]));
		}
		IO.saveFile(JSDOC.opt.d, fileName, JSON.stringify(root));
	} catch(exception) {
		if (exception.rhinoException) {
			exception.rhinoException.printStackTrace();
			print(exception.message + " at line " + exception.rhinoException.lineNumber() + "\n\t" +   exception.rhinoException.lineSource());
		}
	}
};
