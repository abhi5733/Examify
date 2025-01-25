import { Loading, Login, StopLoading } from "./actiontype"




export const LoadingFunction = ()=>{
    return {type:Loading}
}

export const StopLoadingFunction = ()=>{
    return {type:StopLoading}
}

export const LoginFunction = ()=>{
    return {type:Login}
}