import { Observable as O } from "rxjs";

export function crossProduct(v1:number[],v2:number[]){
    if(v1.length != 3 || v2.length != 3) return null
    return [v1[1]*v2[2]-v1[2]*v2[1],v1[2]*v2[0]-v1[0]*v2[2],v1[0]*v2[1]-v1[1]*v2[0]]
}

export function dotProduct(v1:number[],v2:number[]){
    if(v1.length != v2.length) return null
    return v1.reduce((acc,val,i) => {
        return acc + val*v2[i]
    },0)
}