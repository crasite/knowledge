# Matrix Properties

1. AB $\neq$ BA
2. AB $= 0' \nRightarrow (\text A = 0'\ \lor \text B = 0')$
3. 
    - A(BC) = AB(C) $\textcolor{blue} {\therefore\text{Assoziativ}}$
    - AB $\neq$ BC $\textcolor{red} {\therefore\text{nicht Kommitativ}}$
    - A(B + C) = AB + AC $\textcolor{blue} {\therefore\text{Distributiv}}$ \
      (A + B)C = AC + BC 
4. $(\text{AB})^T = \text B^T \text A^T$

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