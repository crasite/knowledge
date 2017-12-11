## Index

 1. [Gauss-Jordan-Methode](#gauss-jordan-method)
 1. [Matrix Creation](#matrix-creation)

## Gauss-Jordan-Method

```typescript
gaussJordan(matrix:number[][])  \\ return Observable
```

$$
\text{for matrix} 
\left(
    \begin{array}{cc|c}
        1&2&3\\
        4&5&6
    \end{array}
\right)
\text{we would use}
$$
<br>

$$
\large[[1,2,3],[4,5,6]]
$$

```typescript
gaussJordan([[1,2,3],[4,5,6]]).subscribe(console.log)
```

<center> Result in: </center>

$$
\left(
    \begin{array}{cc|r}
        1&0&-1\\
        0&1&2
    \end{array}
\right)
$$

## Matrix Creation

```typescript
function createMatrix(matrix:number[],width:number)
```

Create a Matrix in `number[][]` form

```typescript
let matrix = createMatrix([1,0,0,0,1,0,1,2,0,0,0,1,-1,-1,0],5)
```
output  `[[1,0,0,0,1],[0,1,2,0,0],[0,1,-1,-1,0]]` \
which is 

$$
\begin{pmatrix}
1&0&0&0&1 \\
0&1&2&0&0 \\
0&1&-1&-1&0
\end{pmatrix}
$$