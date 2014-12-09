'use strict';

(function( Strophe, $msg, $iq, $pres, Promise, define ){
    
    var XMPPClient = function(){
        // Tratando como function
        if( ! this )
            return new XMPPClient();
        
        // Na construção do objeto, faça o handle da mudança de status
        this.on( 'statusChange', function( status ){

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
                    this__dispatch( 'error' );
                    break;
            }
        } );
    };
    XMPPClient.prototype = {
        // Openfire localhost by default
        host: 'http://localhost:7070/http-bind/',
        stropheConn: null,
        
        // Cada item deve ser um array de functions
        __listeners: {
            attach: [], authenticating: [],
            authFail: [], connect: [],
            connecting: [], connectionFail: [],
            disconnect: [], disconnecting: [],
            error: [], messageReceived: [],
            messageSent: [],
            statusChange: []
        },
        
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
        
        addEventListener: function( event, handler ){
            if( typeof handler != 'function' )
                throw 'Event handler must be a function.';
            
            var events = event instanceof Array ? event : [ event ];
            
            for( var i in events ) {
                if( ! this.__listeners[ events[i] ] )
                    throw 'Event [:evt] not recognized.'.replace( ':evt', events[i] );
                
                this.__listeners[ events[i] ].push( handler );
            }
        },
        
        on: function( event, handler ){
            this.addEventListener( event, handler );
        },
        
        connect: function( username, password, host ){
            var _this = this;
            _this.host = host || _this.host;
            _this.stropheConn = new Strophe.Connection( _this.host );
            
            _this.stropheConn.connect( username, password, function( status ) {
                _this.__dispatch( 'statusChange', status );
            } );
                        
            return new Promise( function( resolve, reject ) {
                
                _this.addEventListener( 'connect', function(){
                    
                    _this.stropheConn.send( $pres().tree() );
                    
                    _this.stropheConn.addHandler( function( msg ){
                        
                        _this.__dispatch( 'messageReceived', {
                            from: msg.getAttribute('from')
                        },
                        msg.getElementsByTagName('body')[0].innerHTML );
                        
                        return true;
                    }, null, 'message', 'chat' );
                    
                    resolve( _this );
                } );
                
                _this.addEventListener(
                    [ 'connectionFail', 'authFail', 'error' ],
                    reject
                );
                
            } );
        },
        
        sendMessage: function( destiny, message ){
            var msg = $msg({
                to: destiny,
                type: 'chat'
            })
            .cnode( Strophe.xmlElement( 'body', message ) ).up()
            .c( 'active', { xmlns: 'http://jabber.org/protocol/chatstates' } );

            this.stropheConn.send( msg );
            this.__dispatch( 'messageSent', { to: destiny }, message );
        }

    };
    
    // @todo -> Refatorar este trecho quando utilizarmos AMD
    define( 'XMPPClient', [], function() {
        if( window ) window.XMPPClient = XMPPClient;
        return XMPPClient;
    } );
    
// @todo -> pegar estes caras usando AMD ou do Window
})( Strophe, $msg, $iq, $pres, RSVP.Promise, ( function() {
    /**
     * Gambiarra mesmo, mas fuciona! OK!?
     */
    return (typeof define == 'function') ? define : function define( module, deps, then ){
        window[module] = then.call( this );
    };

} )() );