import { transpose, gaussJordan, checkResult } from "../matrix/matrix";

type Relation = "windschief" | "echte Parallel" | "identisch" | number[]

export function relationBetweenLine(line1:number[][],line2:number[][]){
    if(line1.length != 2 || line2.length !=  2) return null
    if(line1[0].length != line1[1].length || line2[0].length != line2[1].length || line1[0].length != line2[0].length) return null
    return gaussJordan(createEquation(line1,line2)).last().pluck<any,number[][]>("matrix").map(v => {
        if(checkResult(v)) {
            if(v[0][1] != 0){
                return "identisch"
            } else {
                return [v[0][2],v[1][2]]
            }
        } else {
            return "windschief"
        }
    })
}

function createEquation(line1:number[][],line2:number[][]){
    const tLine1Vector = line1[1]
    const tLine2Vector = line2[1].map(v => -v)
    const tLine1Point = line1[0].map(v => -v)
    const resultArray = tLine1Point.map((v,i) => v+line2[0][i])
    return transpose([tLine1Vector,tLine2Vector,resultArray])
}