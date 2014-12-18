'use strict';

define(
	'xmpp_client/XMPPClient',
	[ 'xmpp_client/XMPPConnection', 'Strophe' ],
	function( XMPPConnection ) {

		function XMPPClient() {
			this.connection = new XMPPConnection( this );

			this.on( 'statusChange', function( status ) {
				var s = Strophe.Status;
				switch( status ) {
					case s.ATTACHED:
						this.__dispatch( 'attach' );
						break;
					case s.AUTHENTICATING:
						this.__dispatch( 'authenticating' );
						break;
					case s.AUTHFAIL:
						this.__dispatch( 'authFail' );
						break;
					case s.CONNECTED:
						this.__dispatch( 'connect' );
						break;
					case s.CONNFAIL:
						this.__dispatch( 'connectionFail' );
						break;
					case s.DISCONNECTED:
						this.__dispatch( 'disconnect' );
						break;
					case s.DISCONNECTING:
						this.__dispatch( 'disconnecting' );
						break;
					case s.ERROR:
						this.__dispatch( 'error' );
						break;
	            }
			} );

		};
		XMPPClient.prototype = {

			connection: null,

			__dispatch: function( event ){
				var handlers = this.__listeners[event];
				if( ! handlers ) return;

				// @todo -> verificar possível incompatibilidade
				var args = Array.prototype.slice.call( arguments );
				args = args.splice(1);

				for( var i in handlers ){
					var handler = handlers[i];
					if( typeof handler != 'function' ) return;
					handler.apply(this, args);
				}
			},

			__listeners: {
				attach: [], authenticating: [],
				authFail: [], connect: [],
				connecting: [], connectionFail: [],
				disconnect: [], disconnecting: [],
				error: [], messageReceived: [],
				messageSent: [],
				statusChange: []
			},
			
			on: function( event, handler ){
				if( typeof handler != 'function' )
					throw 'O handler deve ser uma função';

				var events = event instanceof Array ? event : [ event ];
	            
				for( var i in events ) {
					if( ! this.__listeners[ events[i] ] )
						throw 'Evento [:evt] não encontrado.'.replace( ':evt', events[i] );

					this.__listeners[ events[i] ].push( handler );
	            }

	            return this;
	        },
			connect: function() { throw 'Implementar conexão'; },
			disconnect: function() { throw 'Implementar disconexão'; },
			

			sendMessage: function( destino, mensagem ){
				var msg = $msg({
					to: destino,
					type: 'chat'
				})
				.cnode( Strophe.xmlElement( 'body', mensagem ) ).up()
				.c( 'active', { xmlns: 'http://jabber.org/protocol/chatstates' } );

				this.connection.handler.send( msg );
				this.__dispatch( 'messageSent', { to: destino }, mensagem );
			}

		};

		return XMPPClient;
	}
);