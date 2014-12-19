'use strict';

define( 
	'xmpp_client/WebSocketClient',
	[ 'xmpp_client/XMPPClient', 'xmpp_client/XMPPConnection', 'rsvp', 'Strophe' ],
	function( XMPPClient, XMPPConnection, RSVP ) {

		function WebSocketClient() {
                    if ( typeof this  == 'undefined' )
                        return new WebSocketClient( arguments );
                };
		WebSocketClient.prototype = new XMPPClient();
                
                WebSocketClient.prototype.connect = function( username, password ) {
                    var _this = this;
                    
                    return new RSVP.Promise( function( resolve, reject ) {
                        
                        _this.connection.username = username || _this.connection.username;
                        _this.connection.password = password || _this.connection.password;
                        _this.connection.host = 'http://localhost:7070/ws/server?username='+ username +
                                                '&password='+ password + '&resource=localhost';
                                                
                        _this.connection.connect = function(  ){
                            var _this = this;

				// @todo -> Atualmente utilizando o objeto global :S
				this.handler = new Openfire.Connection( this.host );
                                this.handler.jid = this.username;
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
                        };
                        
                        _this.connection.connect();
                        
                        _this.on( 'connect', function ( ) { 
                            resolve();
                        } )
                        .on( ['error', 'authFail', 'connectionFail' ], function( ){
                            reject();
                        } );
                        
                    } );
                };
                
		return WebSocketClient;
	}
);