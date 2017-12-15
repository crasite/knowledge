import { Observable as O } from "rxjs";
import { div, p } from "@cycle/DOM";

/**
 * gaussJordan
 * @param matrix matrix in form [[1,2,3],[4,5,6]]
 * 
 * example:
 * -------
 * let matrix = createMatrix([1,0,0,0,1,0,1,2,0,0,0,1,-1,-1,0],5)
 * gaussJordan(matrix).subscribe(console.log)
 */
export function gaussJordan(matrix:number[][]){
    return O.of({matrix,index:0}).expand(({matrix,index}) => {
        if(index == matrix.length) return O.empty()
        if(matrix[0].length <= index) return O.empty()
        if(matrix[index][index] == 0) return rearrange(matrix,index)
        return eliminate(matrix,index)
    })
}
function rearrange(matrix:number[][],index:number){
    return O.of({ matrix,target:index,index }).expand(({matrix,target,index}) => {
        if(index == matrix.length) return O.empty()
        if(matrix[target][target] != 0) return O.empty()
        if(matrix[index][target] != 0){
            let a = matrix[target]
            matrix[target] = matrix[index] 
            matrix[index] = a
            return O.of({matrix,target,index})
        } else {
            return O.of({matrix,target,index:index+1})
        }
    }).last().flatMap(result => {
        if(result.matrix[index][index] == 0) return O.of({matrix:result.matrix,index:index+1})
        return O.of({matrix:result.matrix,index})
    })
}
function eliminate(matrix:number[][],index:number){
    let indexRow = matrix[index].map((value,_,arr) => {
        return value/(arr[index])
    })
    matrix[index] = indexRow
    let rs = O.of({matrix,index,row:0}).expand(({matrix,index,row}) => {
        if(row == matrix.length) return O.empty()
        if(row == index) return O.of({matrix,index,row:row+1})
        let newMatrix = matrix.map((rowMatrix,currentRow,arr) => {
            if(currentRow == index) return rowMatrix
            return rowMatrix.map((value,column) => {
                return value - (matrix[index][column]*rowMatrix[index])
            })
        })
        return O.of({matrix:newMatrix,index,row:row+1})
    })
    return rs.last().map(v => ({matrix:v.matrix,index:v.index+1}))
}

/*
 * let matrix = createMatrix([1,0,0,0,1,0,1,2,0,0,0,1,-1,-1,0],5)
*/
export function createMatrix(matrix:number[],width:number){
    if(matrix.length%width != 0) throw new Error("Unvöllständige Matrix")
    let result:number[][] = new Array()
    for(let i = 0;i<matrix.length/width;i++) {
        result.push(matrix.slice(i*width,i*width+width))
    }
    return result
}


/**
 *  Matrix Displayer
 */
export function matrixDisplayer(matrix:number[][]){
    const rows = matrix.map(v => p(`${v}`))
    return div(rows)
}