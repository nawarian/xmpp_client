'use strict';

require(
	[ 'xmpp_client/BOSHClient' ],
	function( BOSHClient ) {
		
		var c = new BOSHClient();

		c.connect( 'teste@packer-debian-6', 'teste' )
		.then( function() {

			c.on( 'messageReceived', function( cabecalhos, msg ) {

				console.warn(
						'[:person] says: :msg'
						.replace(':person', cabecalhos.from)
						.replace(':msg', msg)
				);

			} )

			.on( 'messageSent', function( cabecalhos, msg ) {

				console.warn(
						'[You] sent to [:person]: :msg'
						.replace(':person', cabecalhos.to)
						.replace(':msg', msg)
				);

			} );

			// Jogando objeto no escopo global para que possamos testar
			window.xmppClient = c;

		} )
		.catch( function() {

			// Erro ao conectar-se

		} );

	}
);