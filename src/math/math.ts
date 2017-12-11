import { gaussJordan , createMatrix } from "./modules/matrix/matrix";

let matrix = createMatrix([1,0,0,0,1,0,1,2,0,0,0,1,-1,-1,0],5)
let matrix2 = createMatrix([2,1,-1,-1,3,0,2,-1,0,4,5,3,-1,0,-1],5)
let matrix3 = [[2,1,7.1],[0,2,5],[5,3,0]]
gaussJordan(matrix2).subscribe(console.log)

