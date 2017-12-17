import { Observable as O } from "rxjs";
import { transpose, gaussJordan, checkResult } from "../matrix/matrix";
import { crossProduct, dotProduct } from "./vector";

type LineRelation = "windschief" | "echte Parallel" | "identisch" | number[]
type LinePlaneRelation = "liegt im" | "echte Parallel" | number
type PlaneRelation = "identisch" | "echte Parallel" | number[][]

/**
 * 
 * @param line1 [[p1,p2,p3][x1,x2,x3]]
 * @param line2 [[p1,p2,p3][x1,x2,x3]]
 */
export function relationBetweenLine(line1:number[][],line2:number[][]){
    if (line1.length != 2 || line2.length != 2) return null
    if (line1[0].length != line1[1].length || line2[0].length != line2[1].length || line1[0].length != line2[0].length) return null
    function createEquation(line1: number[][], line2: number[][]) {
        const tLine1Vector = line1[1]
        const tLine2Vector = line2[1].map(v => -v)
        const tLine1Point = line1[0].map(v => -v)
        const resultArray = tLine1Point.map((v, i) => v + line2[0][i])
        return transpose([tLine1Vector, tLine2Vector, resultArray])
    }
    return gaussJordan(createEquation(line1, line2)).last().pluck<any, number[][]>("matrix").map<number[][], LineRelation>(v => {
        if (checkResult(v)) {
            if (v[0][1] != 0) {
                return "identisch"
            } else {
                return [v[0][2], v[1][2]]
            }
        } else {
            if (v[1][1] == 0) {
                return "echte Parallel"
            } else {
                return "windschief"
            }
        }
    })
}

/**
 * 
 * @param line [[p1,p2,p3][x1,x2,x3]]
 * @param plane [a1,b2,c3,p] ax1+bx2+cx3 = p or [[p1,p2,p3],[u1,u2,u3],[v1,v2,v3]]
 */
export function relationBetweenLineAndPlane(line:number[][],plane:number[]|number[][]):LinePlaneRelation{
    function result(rs:number[]):LinePlaneRelation{
        if(rs[0] == rs[1] && rs[0] == 0) return "liegt im"
        if(rs[0] == 0 && rs[1] != 0) return "echte Parallel"
        return rs[1]/rs[0]
    }
    function isParameter(plane:number[]|number[][]): plane is number[][]{
        return plane[0] instanceof Array
    }
    if(isParameter(plane)){
        const p = toNormal(plane)
        const right = p[3]-line[0].reduce((acc,val,i) => acc+val*p[i],0)
        const left = line[1].reduce((acc,val,i) => acc+val*p[i],0)
        return result([left,right])
    } else {
        const p = plane
        const right = p[3]-line[0].reduce((acc,val,i) => acc+val*p[i],0)
        const left = line[1].reduce((acc,val,i) => acc+val*p[i],0)
        return result([left,right])
    }
}

export function toNormal(f: number[][]) {
    if (f[0].length != 3) throw "Not a parameter function";
    const normalVector = crossProduct(f[1], f[2])
    const realP = dotProduct(normalVector, f[0])
    return [...normalVector, realP]
}

export function relationBetweenPlane(plane1:number[]|number[][],plane2:number[]|number[][]):O<PlaneRelation>{
    function isParameter(plane:number[]|number[][]): plane is number[][]{
        return plane[0] instanceof Array
    }
    const p1 = (isParameter(plane1))? toNormal(plane1) : plane1
    const p2 = (isParameter(plane2))? toNormal(plane2) : plane2
    return gaussJordan([p1,p2]).pluck<any,number[][]>("matrix").map(v => {
        if(v[1].every(v => v== 0)) return 'identisch'
        if(!checkResult(v)) return 'echte Parallel'
        else return v
    })//.map(v => checkResult(v))
}