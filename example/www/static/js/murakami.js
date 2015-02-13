formatParameters = function( parentEl, parameters, key ) {
	if ( parameters.length > 0 ) {
		var newEl = document.createElement( 'div' );
		newEl.setAttribute( 'class', 'parameterList' );
		parentEl.appendChild( newEl );
		parentEl = newEl;
		for( var k = 0; k < parameters.length; k++ ) {
			var rowEl = document.createElement( 'dl' );
			rowEl.setAttribute( 'class', 'parameter' );
			parentEl.appendChild( rowEl );
			var row = parameters[k];
			for ( var paramType in row ) {
				if ( row.hasOwnProperty(paramType ) ) {
					var divEl = document.createElement( 'div' );
					divEl.setAttribute( 'class', 'kvPair' ); 
					rowEl.appendChild( divEl );
					var dtEl = document.createElement( 'dt' );
					dtEl.setAttribute( 'class', 'key ' + paramType ); 
					divEl.appendChild( dtEl );
					var textEl = document.createTextNode( paramType );
					dtEl.appendChild( textEl );
					var ddEl = document.createElement( 'dd' );
					ddEl.setAttribute( 'class', 'value ' + paramType ); 
					divEl.appendChild( ddEl );
					textEl = document.createTextNode( row[paramType] );
					ddEl.appendChild( textEl );
				}
			}
		}
	}
}
formatMethod = function( itemDetailsEl, itemDetails ) {
	window.setTimeout( function( ) {
		itemDetailsEl.innerHTML = '';
		var dlEl = document.createElement( 'dl' );
		dlEl.setAttribute( 'class', 'itemDetails' );
		itemDetailsEl.appendChild( dlEl );
		for ( var key in itemDetails ) {
			if ( itemDetails.hasOwnProperty( key ) ) {
				var divEl = document.createElement( 'div' );
				divEl.setAttribute( 'class', 'kvPair' )
				dlEl.appendChild( divEl );
				var dtEl = document.createElement( 'dt' );
				var dtTextEl = document.createTextNode( key );
				dtEl.appendChild( dtTextEl );
				dtEl.setAttribute( 'class', 'key ' + key )
				divEl.appendChild( dtEl );
				var ddEl = document.createElement( 'dd' );
				if ( key == 'examples' ) {
					for ( var ex = 0; ex < itemDetails[key].length; ex++ ) {
						var preEl = document.createElement( 'pre' );
						preEl.setAttribute( 'class', 'code' );
						ddEl.appendChild( preEl );
						var txtEl = document.createTextNode( itemDetails[key][ex] || '' );
						preEl.appendChild( txtEl );
					}
				} else if ( key == 'returns' ) {
					formatParameters( ddEl, itemDetails[key], key );
				} else if ( key == 'see' ) {
					for ( var se = 0; se < itemDetails[key].length; se++ ) {
						var spanEl = document.createElement( 'span' );
						spanEl.setAttribute( 'class', 'see' );
						ddEl.appendChild( spanEl );
						var txtEl = document.createTextNode( itemDetails[key][se] || '' );
						spanEl.appendChild( txtEl );
					}
				} else if ( key == 'parameters' || key == 'returns'  ) {
					formatParameters( ddEl, itemDetails[key], key );
				} else {
					ddEl.innerHTML = itemDetails[key] || '&nbsp;'; 
				}
				ddEl.setAttribute( 'class', 'value ' + key )
				divEl.appendChild( ddEl );
				
			}
		}
	}, 1 );
};
showDetails = function( className, type, name ) {
	var itemDetailsEl = document.getElementById( 'itemDetails' );
		for ( var i = 0; i < doc.classes.length; i++ ) {
			var classDetails = doc.classes[i];
			if ( classDetails.name == className ) {
					if ( type == 'constructor' ) {
						var itemDetails = classDetails[type];
						formatMethod( itemDetailsEl, itemDetails );
					} else { 
						for( var j = 0; j < classDetails[type].length; j++ ) {
							var itemDetails = classDetails[type][j];
							if ( itemDetails.name == name ) {
								formatMethod( itemDetailsEl, itemDetails );
							}
						}
					}
			}
	}
};
showClassDetails = function( className ) {
	var classDetailsEl = document.getElementById( 'classDetails' );
	var itemDetailsEl = document.getElementById( 'itemDetails' );
	for ( var i = 0; i < doc.classes.length; i++ ) {
		var classDetails = doc.classes[i];
		if ( classDetails.name == className ) {
			window.setTimeout( function() {
				classDetailsEl.innerHTML = '';
				itemDetailsEl.innerHTML = '';
				var dlEl = document.createElement( 'dl' );
				dlEl.setAttribute( 'class', 'classDetails' );
				classDetailsEl.appendChild( dlEl );
				for ( var key in classDetails ) {
					if ( classDetails.hasOwnProperty( key ) ) {
						var divEl = document.createElement( 'div' );
						divEl.setAttribute( 'class', 'kvPair' )
						dlEl.appendChild( divEl );
						var dtEl = document.createElement( 'dt' );
						var dtTextEl = document.createTextNode( key );
						dtEl.appendChild( dtTextEl );
						dtEl.setAttribute( 'class', 'key ' + key )
						divEl.appendChild( dtEl );
						var ddEl = document.createElement( 'dd' );
						if ( key == 'examples' ) {
							for ( var ex = 0; ex < classDetails[key].length; ex++ ) {
								var preEl = document.createElement( 'pre' );
								preEl.setAttribute( 'class', 'code' );
								ddEl.appendChild( preEl );
								var txtEl = document.createTextNode( classDetails[key][ex] || '' );
								preEl.appendChild( txtEl );
							}
						} else if ( key == 'fields' ) {
								formatParameters( ddEl, classDetails[key], key );
						} else if ( key == 'see' ) {
							for ( var se = 0; se < classDetails[key].length; se++ ) {
								var spanEl = document.createElement( 'span' );
								spanEl.setAttribute( 'class', 'see' );
								ddEl.appendChild( spanEl );
								var txtEl = document.createTextNode( classDetails[key][se] || '' );
								spanEl.appendChild( txtEl );
							}
						} else if ( key == 'fires' || key == 'functions' || key == 'fields' ) {
							for( var j = 0; j < classDetails[key].length; j++ ) {
								var name = classDetails[key][j].name;
								var buttonEl = document.createElement( 'button' );
								buttonEl.setAttribute( 'class', 'classDetail '+ key );
								buttonEl.setAttribute( 'onclick', 'showDetails( \'' + classDetails.name +'\', \'' + key + '\', \'' + name + '\' );' );
								var textEl = document.createTextNode( name );
								buttonEl.appendChild( textEl );
								ddEl.appendChild( buttonEl );
							}
						} else if ( key == 'constructor' ) {
								var name = classDetails[key].name;
								if ( name ) {
									var buttonEl = document.createElement( 'button' );
									buttonEl.setAttribute( 'class', 'classDetail '+ key );
									buttonEl.setAttribute( 'onclick', 'showDetails( \'' + classDetails.name +'\', \'' + key + '\', \'' + name + '\' );' );
									var textEl = document.createTextNode( name );
									buttonEl.appendChild( textEl );
									ddEl.appendChild( buttonEl );
								}
						} else {
							ddEl.innerHTML = classDetails[key] || '&nbsp;'; 
						}
						ddEl.setAttribute( 'class', 'value ' + key )
						divEl.appendChild( ddEl );
						
					}
				}
			},1 );	
			break;
		}
	}

};
showClassList = function() {
	var classListEl = document.getElementById( 'classList' );
	window.setTimeout( function() {
		classListEl.innerHTML = '';
		for ( var i = 0; i < doc.classes.length; i++ ) {
			var classDetails = doc.classes[i];
			var buttonEl = document.createElement( 'button' );
			buttonEl.setAttribute( 'class', 'className' );
			buttonEl.setAttribute( 'onclick', 'showClassDetails( \'' + classDetails.name + '\' );' );
			var textEl = document.createTextNode( classDetails.name );
			buttonEl.appendChild( textEl );
			classListEl.appendChild( buttonEl );
		}
	}, 1 );
}

