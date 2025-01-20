import { Loading, Login, StopLoading } from "./ActionType"

const initialState={
    load : false ,
    login : false ,
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