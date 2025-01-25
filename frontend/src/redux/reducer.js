import { Loading, Login, StopLoading } from "./actiontype"

const initialState={

    load : false ,
    login : localStorage.getItem("tokens") || false ,
    token : localStorage.getItem("tokens") || null ,

}


export const reducer = (state=initialState,{type})=>{

    switch(type){

    case Loading :
        return {...state,load:true}

    case StopLoading:
        return {...state,load:false}

    case Login :
        return {...state,load:false,login:true,token : localStorage.getItem("tokens")}

    default :
        return state

    }

}