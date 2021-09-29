// Here All the logic for sockets is written
import React,{ createContext,useState,useEffect,useRef}  from 'react';
import {io} from 'socket.io-client';
import Peer from 'simple-peer';

// Connect to this server
const socket=io("http://localhost:8000");

const SocketContext=createContext();


const ContextProvider = ({children}) => {

    // for having state in functional components this usestate hook is used

    // Stream will contain track of audio and video returned by navigator.getmedia
    const [stream,setStream]=useState(null);
    const [me,setMe]=useState('');
    const [call,setCall]=useState({});
    const [callAccepted,setCallAccepted]=useState(false);
    const [callEnded,setCallEnded]=useState(false);
    const [name,setName]=useState('');
    // this hook is used to control a DOM element "Video here"
    const myVideo=useRef();
    const userVideo=useRef();
    const connectionRef=useRef();

//    Alternative for componentdidmount so this is called immeditely after mounting of the component
    useEffect(()=>{
        // So when the compinent is mounted ask user for mic and camera permission id it allows set it to strea,
        navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((currentStraem)=>{
            setStream(currentStream);
            //  current is there in useref hook
            myVideo.current.srcObject=currentStraem;
        });

        socket.on('me',(id)=>{
            setMe(id);
        });

        socket.on('calluser',({from,name:callerName,signal})=>{
            // When another user calls
            setCall({isReceived:true,from,name:callerName,signal});
        });
    },[]);
    //  pass dependencies else it will be called on every re render


    // Answer the call
   const answerCall=()=>{
    //    So when we will call this first set callaccepted to true so we will not see that answer button
    setCallAccepted(true);
    const peer=new Peer({initiator:false,trickle:false,stream});
    peer.on('signal',(data)=>{
        // So when we will receive signal what should we so emit answercall
        // Call was set initially by calluser action 
        socket.emit("answercall",{signal:data,to:callAccepted.from});
    });
    // See first the connetion signal will be sent and then stream will be sent
    peer.on('stream',currentStream=>{
        userVideo.current.srcObject=currentStream;
    });

    // Now i will sognal too

    peer.signal(call.signal);

    connectionRef.current=peer;

   };


//    Make a Call
   const callUser=(id)=>{
  
    const peer=new Peer({initiator:true,trickle:false,stream});
    peer.on('signal',(data)=>{
        // So when we will receive signal what should we so emit answercall
        // Call was set initially by calluser action 
        socket.emit("calluser",{userToVall:id,signal:data,from:me,name});
    });
    // See first the connetion signal will be sent and then stream will be sent
    peer.on('stream',currentStream=>{
        userVideo.current.srcObject=currentStream;
    });

    socket.on('callaccepted',(signal)=>{
        setCallAccepted(true);
        
        peer.signal(signal);
    });

    // Now i will sognal too

    peer.signal(call.signal);

    connectionRef.current=peer;

   };


   const leaveCall=()=>{
       setCallEnded(true);
       connectionRef.current.destroy();
    
        // So that id changes and other user cannot call immediately
       window.location.reload();
   };
   return (
    //    the data will be available to all the components
       <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            name,
            stream,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall


       }}>
           {children}

       </SocketContext.Provider>
   );
   


}
 
export default {ContextProvider,SocketContext};


