---
layout: single
title: "MathJax"
permalink: /math/ 
classes: wide
---
# Automatic Equation Numbering
The equation should show up like this
\begin{equation} \label{pythagoras}
a^2 + b^2 = c^2.
\end{equation}

And it can be referred by \eqref{MEE}.

Equation without a tag is numbered automatically.
\begin{equation} \label{EId}
    e^{i\pi} + 1 = 0.
\end{equation}
Euler's identity is \eqref{EId}. 

# Custom Tag
Equation in another section, like Pythagoras theorem \eqref{pythagoras}
\begin{equation} \label{MEE} \tag{Mass-Energy Equivalence}
E = mc^2.
\end{equation}

# LaTeX Macro
Macros can be used as follows
\\[
    \BR, \ddx{f}.
\\]