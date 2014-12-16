'use strict';

require(
	[ 'xmpp_client/BOSHClient' ],
	function( BOSHClient ) {
		
		var c = new BOSHClient();
		c.connect()
		.then( function() {

			c.on( 'messageReceived', function( cabecalhos, msg ) {

				// messageReceived

			} )

			.on( 'messageSent', function( headers, msg ) {

				// messageSent

			} )

			.on( 'connect', function() {

				console.warn( 'Conexão estabelecida.' );

			} );

			// Jogando objeto no escopo global para que possamos testar
			window.xmppClient = c;

		} )
		.catch( function() {

			// Erro ao conectar-se

		} );

	}
);