module.exports = {
    
    mixer : {
        
        channel : {
        
            add : {

                channelName : {
                    title : 'Missing Parameter: channelName',
                    content : 'Please include the name of the Mixer Streamer you would like to add to the announcement list' + "\n\n"
                        + '**Command Format**: `trw add mixer channel <channelName> <#announcementChannel>`'
                },

                announcementChannel : {
                    title : 'Missing Parameter: announcementChannel',
                    content : 'Please include the name of the Discord Channel you would like this Streamer to be announced in' + "\n\n"
                        + 'Alternatively, you can run `trw config set mixerAnnouncementChannel <channelName>` to have all Mixer streamers announced in the same Discord channel by default' + "\n\n"
                        + 'You can also set a default fallback channel for all streamers by running `trw config set defaultAnnouncementChannel <channelName>`.' + "\n\n"
                        + '**Command Format**: `trw add mixer channel <channelName> <#announcementChannel>`'
                }

            },

            remove : {

                channelName : {
                    title : 'Missing Parameter: channelName',
                    content : 'Please include the name of the Mixer Streamer you would like to remove from the announcement list' + "\n\n"
                        + '**Command Format**: `trw remove mixer channel <channelName>`'
                },

            },

            update : {

                channelName : {
                    title : 'Missing Parameter: channelName',
                    content : 'Please include the name of the Mixer Streamer you would like to update' + "\n\n"
                        + '**Command Format**: `trw update mixer channel <channelName> <#announcementChannel>`'
                },

                announcementChannel : {
                    title : 'Missing Parameter: announcementChannel',
                    content : 'Please include the name of the Discord Channel you would like this Streamer to be announced in.' + "\n\n"
                        + 'Alternatively, you can run `trw config set mixerAnnouncementChannel <channelName>` to have all Mixer streamers announced in the same Discord channel by default' + "\n\n"
                        + 'You can also set a default fallback channel for all streamers by running `trw config set defaultAnnouncementChannel <channelName>`.' + "\n\n"
                        + '**Command Format**: `trw update mixer channel <channelName> <#announcementChannel>`'
                }

            },
            
            list : {}
            
        }
        
    },
    
    
    twitch : {},
    
    
    youtube : {},
    
    
    config : {
    
        set : {
            
            optionName : {
                title : 'Missing Parameter: optionName',
                content : 'Please include the name of the option you would like to set.' + "\n\n"
                    + '**Command Format**: `trw config set <optionName> <optionValue>`'
            },
            
            optionValue : {
                title : 'Missing Parameter: optionValue',
                content : 'Please include the value of the option you would like to set.' + "\n\n"
                    + '**Command Format**: `trw config set <optionName> <optionValue>`'
            }
            
        },
        
        get : {
            
            optionName : {
                title : 'Missing Parameter: optionName',
                content : 'Please include the name of the option you would like to get.' + "\n\n"
                    + '**Command Format**: `trw config get <optionName>`'
            }
            
        },
        
        list : { }
        
    }
    
}