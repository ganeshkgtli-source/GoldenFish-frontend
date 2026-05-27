import { useEffect } from "react";

import { socketEngine } from "../core/socket";

import { socketManager } from "../managers/socketManager";

import { useRealtimeStore } from "../store/realtimeStore";

import type { SocketEvent } from "../types/socket.types";
import type { Error } from "../types/error.types";
import { ERRORS_CHANNELS } from "../channels/errors.channel";
 


type DeletePayload = {
  id: number;
};


type ErrorsSocketPayload = Error[] | Error | DeletePayload;


export const useErrorsSocket=(
    type: string = "self",
    clientId?: string,
)=>{

useEffect(()=>{
    socketManager.init();
    socketEngine.connect()
    const userId = "current_user";
 const{ setErrors,addError ,updateError,removeError} = useRealtimeStore.getState();


 let channel = ERRORS_CHANNELS.USER(String(userId));
 if(type ==="admin"){
    channel = ERRORS_CHANNELS.ALL
 }

if(type === "client" && clientId){
    channel = ERRORS_CHANNELS.CLIENT(String(clientId))
}
 console.log("[Error SOCKET CHANNEL]", channel);

const unsubscribe = socketManager.subscribe<ErrorsSocketPayload>(
    channel,(SocketEvent)=>{
        const{ event :eventType ,data}= SocketEvent as SocketEvent<ErrorsSocketPayload> ;
        if (eventType === "snapshot"){

            if(Array.isArray(data)){
                const sorted= [...data].sort((a,b)=>
                    new Date(b.created_at).getTime()- new Date(a.created_at).getTime() ,
                )

                setErrors(sorted)
            }
            return ;
        }
if(eventType === "created"){
    if (data && typeof data === "object" && "id" in data){
        addError(data as Error)
    }
    return
}
if( eventType ==="updated"){
    if (data && typeof data == "object" && "id" in data){
        updateError(data as Partial<Error> & {
            id:number
        })
    }
    return
}
 if (eventType === "deleted") {
          if (data && typeof data === "object" && "id" in data) {
            removeError(data.id);
          }
        }
      },
   
)

  return () => {
      console.log("[ERRORS SOCKET CLEANUP]", channel);

      unsubscribe();
    };

},[type, clientId])

}