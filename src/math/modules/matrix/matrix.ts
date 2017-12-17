import { Observable as O } from "rxjs";
import toFraction from "../numberToFraction";
import { div, p } from "@cycle/DOM";
import  toVNode from "snabbdom/tovnode";
import { renderToString } from "katex";

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
    const pdiv = document.createElement('div')
    pdiv.innerHTML = renderToString(createMatrixKatex(matrix))
    return   toVNode(pdiv.childNodes[0])
    // return div(rows)
}

function createMatrixKatex(matrix:number[][]){
    const inbetween = matrix.reduce((acc,mRow) => {
        return acc+mRow.reduce((acc,val) => {
            if(acc.length == 0) return toFraction(val)
            return acc+'&'+toFraction(val)
        },'')+'\\\\'
    },'')
    if(matrix[0].length > 1){
        const top = '\\left(\\begin{array}{'+'c'.repeat(matrix[0].length-1)+'|c}'
        const end = '\\end{array}\\right)'
        return top+inbetween+end
    }
    return ''
}

/**
 *  Tranpose Matrix 
 * @param matrix
 */
export function transpose(matrix: number[][]):number[][] {
    function fillColumn(row:number,max:number,index:number,result:number[]){
        if(index >= max) return [...result,matrix[index][row]]
        else return fillColumn(row,max,index+1,[...result,matrix[index][row]])
    }
    const result = matrix[0].reduce((acc,val,inx) => {
        if(inx >= matrix[0].length) return acc
        return [...acc,fillColumn(inx,matrix.length-1,0,[])]
    },[])
    return result
}

export function checkResult(matrix:number[][]){
    function validRow(row:number[]){
        if(row.filter((v,index) => {
            if(index != row.length-1){
                return v!=0
            } 
            return false
        }).length > 0) return true
        if(row[row.length-1] != 0) return false
        return true
    }
    return matrix.every(validRow)
}