'use strict';

require(
	[ 'xmpp_client/WebSocketClient' ],
	function( WebSocketClient ) {
            
                var username = document.getElementById( "username" ),
                    password = document.getElementById( "password" ),
                    btnLogin = document.getElementById( "btn-login" ),
                    loginBox = document.getElementById( "login" ),
                    messageBox = document.getElementById( "msg-sender" ),
                    sendButton = document.getElementById( "sendButton" ),
                    msgList = document.getElementById( "messageList" );
		
                btnLogin.onclick = function( ) {
                    var c = new WebSocketClient();
                    
                    var jid = username.value;
                
                    c.connect( jid, password.value )
                    .then( function() {
                        loginBox.style.display = "none";
                        messageBox.style.display = "block";
                        
                            c.on( 'messageReceived', function( cabecalhos, msg ) {
                                
                                var messageReceived = document.createElement( "div" ),
                                    userLabel = document.createElement( "h3" ),
                                    message = document.createElement( "p" );
                                    
                                    userLabel.innerHTML = cabecalhos.from;
                                    message.innerHTML = msg;
                                    messageReceived.className = "msg-received";
                                    
                                    messageReceived.appendChild( userLabel );
                                    messageReceived.appendChild( message );
                                    
                                    msgList.appendChild( messageReceived );

                            } )

                            .on( 'messageSent', function( cabecalhos, msg ) {
                                
                                var messageReceived = document.createElement( "div" ),
                                    userLabel = document.createElement( "h3" ),
                                    message = document.createElement( "p" );
                                    
                                    userLabel.innerHTML = cabecalhos.to;
                                    message.innerHTML = msg;
                                    messageReceived.className = "msg-sent";
                                    
                                    messageReceived.appendChild( userLabel );
                                    messageReceived.appendChild( message );
                                    
                                    msgList.appendChild( messageReceived );

                            } );

                            // Jogando objeto no escopo global para que possamos testar
                            window.xmppClient = c;

                    } )
                    .catch( function() {
                        
                        var alerta = document.getElementById( "warning-msg" );
                
                        alerta.innerHTML = "Erro ao logar. Verifique se as informações informadas estão corretas.";
                        alerta.style.display = "block";
                            // Erro ao conectar-se

                    } );
                    
                    sendButton.onclick = function ( ) {
                        var destino = document.getElementById("destino").value,
                            mensagem = document.getElementById("mensagem").value;
                    
                        c.sendMessage(destino, mensagem);

                     };

                };
                
	}
);