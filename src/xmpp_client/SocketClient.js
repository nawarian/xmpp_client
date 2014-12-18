'use strict';

define(
	'xmpp_client/SocketClient',
	[ 'xmpp_client/XMPPClient' ],
	function( XMPPClient ) {

		function SocketClient() {};
		SocketClient.prototype = new XMPPClient();


		return SocketClient;
	}
);