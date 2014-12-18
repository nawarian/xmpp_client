'use strict';

require.config( {

	baseUrl: './src/',

	paths: {
		'rsvp': '../bower_components/rsvp/rsvp.amd',
		'Strophe': '../bower_components/strophe/strophe'
	},

	shim: {
		'strophe': {
			exports: 'Strophe'
		}
	}

} );