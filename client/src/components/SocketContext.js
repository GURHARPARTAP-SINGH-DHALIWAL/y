// Here All the logic for sockets is written
import React,{ createContext,useState,useEffect,useRef}  from 'react';
import {io} from 'socket.io-client';
import SimplePeer from 'simple-peer';

// Connect to this server
const socket=io("http://localhost:8000");

const SocketContext=createContext();


const ContextProvider = ({children}) => {

    // for having state in functional components this usestate hook is used

    // Stream will contain track of audio and video returned by navigator.getmedia
    const [stream,setStream]=useState(null);
    const [id,setId]=useState('');
    const [call,setCall]=useState({});
    // this hook is used to control a DOM element "Video here"
    const myVideo=useRef();

//    Alternative for componentdidmount so this is called immeditely after mounting of the component
    useEffect(()=>{
        // So when the compinent is mounted ask user for mic and camera permission id it allows set it to strea,
        navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((currentStraem)=>{
            setStream(currentStream);
            //  current is there in useref hook
            myVideo.current.srcObject=currentStraem;
        });

        socket.on('me',(id)=>{
            setId(id);
        });

        socket.on('calluser',({from,name:callerName,signal})=>{
            setCall({isReceived:true,from,name:callerName,signal});
        });
    },[]);
    //  pass dependencies else it will be called on every re render


}
 
export default ContextProvider;


