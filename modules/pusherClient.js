import { setPusherClient } from 'react-pusher';

let pusherClient = null;

if(typeof window !== 'undefined'){
    const Pusher = require('pusher-js');
    pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,  
        forceTLS: true,
    });

    setPusherClient(pusherClient);
}




export default pusherClient;