'use strict';

define(
	'xmpp_client/BOSHClient',
	[ 'xmpp_client/XMPPClient', 'xmpp_client/XMPPConnection' ],
	function( XMPPClient, XMPPConnection ) {

		function BOSHClient() {
			if( typeof this == 'undefined' )
				return new BOSHClient( arguments );

			this.connection = new XMPPConnection();
		};
		BOSHClient.prototype = new XMPPClient();

		return BOSHClient;
	}
);