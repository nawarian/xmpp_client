'use strict';

define(
	'xmpp_client/XMPPClient',
	[],
	function() {

		function XMPPClient() {};
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
			sendMessage: function() { throw 'Implementar envio de mensagem' }

		};

		return XMPPClient;
	}
);