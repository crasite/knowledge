# Matrixen Rechnung

$A_{m\times n}$ ist Ein Matrix mit $m$ Reihen und $n$ Spalten

## Spezialle Matrixen

* Spaltematrix => $A_{m\times 1}$
* Zeilematrix oder $n$-Tupel => $A_{1\times n}$
* $0$ oder  Nullmatrix => $A_{m\times n}$ mit $a_{ij} = 0$
* Quadratische Matrix mit $n$-te Ordung => $A_{n\times n}$
* $e_i$ = $\begin{vmatrix} 0\\:\\1\\0\\:\\0 \end{vmatrix}$ mit $1$ in der i-te Zeile

## Inverse

* 2x2 matrix

$$
A = \begin{pmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{pmatrix}
\therefore
A^{-1} = \frac{1}{\det A}\begin{pmatrix}
a_{22} & -a_{12} \\
-a_{21} & a_{11}
\end{pmatrix}
$$

* $n x n$ Matrix durch Adjunkte

$$
A^{-1} = \frac{1}{\det A} \begin{pmatrix} 
U_{11} & U_{12} &\cdots & U_{1n} \\ 
U_{21} & U_{22} & &U_{2n} \\
\vdots &  & \ddots & \vdots \\ 
U_{n1} & \cdots & U_nn \end{pmatrix} \text{ Wenn U ein Adjunkte von A ist}
$$

* $n x n$ Matrix durch Gauß-Jordan Verfahren

$$
(A|E) \xrightleftharpoons{Transformiert} (E|A^{-1})
$$

## Umkehr matrix

1. $(A|E) \xrightleftharpoons{Transformiert} (E|A^{-1})$
2. Wenn $AX = B$ then $\therefore (A|B) \xrightleftharpoons{Transformiert} (E|X)$
2. Wenn $XA = B$ then $\therefore (A^T|B^T) \xrightleftharpoons{Transformiert} (E|X^T)$