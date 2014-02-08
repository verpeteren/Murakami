load(JSDOC.opt.t + '/json2.js');
//some ustility filters
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
function Each(targetArray, orgArray, formatFunction) {
	if (orgArray && orgArray.length > 0 ) {
		for (var i = 0; i < orgArray.length; i++) {
			targetArray.push(formatFunction(orgArray[i]));
		}
	}
}

/*format tools*/
function formatExample(example) {

	return example.desc || "";
}

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

function formatExtend(symbol) {
	return symbol.alias;
}

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


function publish(symbolSet) {
	try {
		publish.conf = {
			templateName: 'murakami',
			templateVersion: '0.0.1',
			templateLink: 'https://github.com/verpeteren/murakami/'
		};
		var root = {'classes': []};
		var symbols = symbolSet.toArray();
		var classes = symbols.filter(isaClass).sort(makeSortby('alias'));
		for (var i = 0, l = classes.length; i < l; i++) {
			var symbol = classes[i];
			var thisClass = formatClass(symbol)
			root["classes"].push(thisClass);
		}
		//root = classes;
		if (JSDOC.opt.d === 'console/') {
			print(JSON.stringify(root));
		} else {
			print('This template only supports output to the console. Use the option "-d=console" when you run JSDoc.');
		}
	} catch(exception) {
		if (exception.rhinoException) {
			exception.rhinoException.printStackTrace();
			print(exception.message + " at line " + exception.rhinoException.lineNumber() + "\n\t" +   exception.rhinoException.lineSource());
		}
	}
};
