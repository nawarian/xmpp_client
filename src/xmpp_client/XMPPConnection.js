'use strict';

define(
	'xmpp_client/XMPPConnection',
	[ 'Strophe' ],
	function() {

		function XMPPConnection( client ) {
			if( typeof this == 'undefined' )
				return new XMPPConnection( client );

			this.client = client;
		};
		XMPPConnection.prototype = {

			username: 'nobody',
			password: 'nobody',
			host: null,
			handler: null,
			client: null,

			connect: function() {
				var _this = this;

				// @todo -> Atualmente utilizando o objeto global :S
				this.handler = new Strophe.Connection( this.host );
				this.handler.connect( this.username, this.password, function( status ) {

					_this.client.__dispatch( 'statusChange', status );

				} );

				this.client.on( 'connect', function() {
					_this.handler.send( $pres().tree() );
				} );

				this.handler.addHandler( function( msg ) {

					_this.client.__dispatch( 'messageReceived', {
						from: msg.getAttribute( 'from' )
					}, msg.getElementsByTagName('body')[0].innerHTML );

					return true;
				}, null, 'message', 'chat' );

			},

			disconnect: function() {
				throw 'Implementar desconexão';
			}

		};

		return XMPPConnection;
	}
);