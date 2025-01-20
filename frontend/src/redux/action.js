import { Loading, Login, StopLoading } from "./ActionType"




export const LoadingFunction = ()=>{
    return {type:Loading}
}

export const StopLoadingFunction = ()=>{
    return {type:StopLoading}
}

export const LoginFunction = ()=>{
    return {type:Login}
}