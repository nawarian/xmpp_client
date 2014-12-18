'use strict';

define(
	'xmpp_client/BOSHClient',
	[ 'xmpp_client/XMPPClient', 'xmpp_client/XMPPConnection', 'rsvp', 'Strophe' ],
	function( XMPPClient, XMPPConnection, RSVP ) {

		function BOSHClient() {
			if( typeof this == 'undefined' )
				return new BOSHClient( arguments );
		};
		BOSHClient.prototype = new XMPPClient();

		BOSHClient.prototype.connect = function( username, password ) {
			var _this = this;
			return new RSVP.Promise( function( resolve, reject ) {

				_this.connection.host = 'http://localhost:7070/http-bind/';
				_this.connection.username = username || _this.connection.username;
				_this.connection.password = password || _this.connection.password;
				
				_this.connection.connect();

				_this
				.on( 'connect', function() {
					resolve();
				} )
				.on( [ 'error', 'authFail', 'connectionFail' ], function() {
					reject();
				} );

			} );
		};

		return BOSHClient;
	}
);