/*============================================================================*/
/* TRWBot Commands
/*============================================================================*/
/* Used to validate command calls before any heavy processing is required
/*============================================================================*/
/* @version     0.1.0
/* @since       0.1.0
/*============================================================================*/
/* @package     TRWBot
/* @author      JRMATRIX <jrm47r1x@gmail.com>
/* @copyright   2019 JRMATRIX
/*============================================================================*/

module.exports = {

    mixer : {
        Operators : [ 'add', 'remove', 'list', 'update' ],
        Contexts : [ 'channel', 'team', 'game' ]
    },

    twitch : {
        Operators : [ 'add', 'remove', 'list', 'update' ],
        Contexts : [ 'channel', 'team', 'game' ]
    },

    youtube : {
        Operators : [ 'add', 'remove', 'list', 'update' ],
        Contexts : [ 'channel' ]

    },

    config : {
        Operators : [ 'get', 'set', 'update', 'list' ]
    }
    
}