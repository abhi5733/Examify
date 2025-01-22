import { Loading, Login, StopLoading } from "./ActionType"

const initialState={
    load : false ,
    login : localStorage.getItem("tokens") || false ,
    token : ""
}


export const reducer = (state=initialState,{type})=>{

    switch(type){

    case Loading :
        return {...state,load:true}

    case StopLoading:
        return {...state,load:false}

    case Login :
        return {...state,load:false,login:true}

    default :
        return state

    }

}