---
title: "Notes on Category Theory"
subtitle: "A Formal Summary of Core Concepts"
slug: "category-theory-summary"
category: "Math"
publishDate: "2025-09-21"
excerpt: "A formal summary of the core concepts in category theory, including definitions of categories, morphisms, functors, and natural transformations."
readingTime: 6
tags: ["category-theory", "abstract-algebra", "mathematics", "functors"]
---

## Definition

A **category** is a triple $C=(ob(C), \text{hom(C)}, \circ)$ consisting of the following data:

- **Objects**: A class $ob(C)$ of elements called objects. This class is not required to be a set.
- **Morphisms**: A class $hom(C)$ of elements called morphisms.
  - Each morphism $f \in hom(C)$ corresponds to an ordered pair of objects $(X, Y)$, where X is the **domain** and Y is the **codomain**. This is written as $f: X \rightarrow Y$.
  - The collection of all morphisms from X to Y is the **hom-class**, denoted by $Hom_C(X, Y)$.
- **Identity Morphisms**: For each object A, there exists an identity morphism $Id_A \in Hom_C(A, A)$.
- **Composition**: For each triple of objects X, Y, Z, there is a binary operation $\circ: Hom_C(X,Y) \times Hom_C(Y,Z) \rightarrow Hom_C(X,Z)$, which maps a pair of morphisms $(f,g)$ to their composition $g \circ f$.

---
## Axioms

Composition must satisfy two axioms:

- **Associativity**: For any morphisms $f \in Hom_C(X,Y)$, $g \in Hom_C(Y,Z)$, and $h \in Hom_C(Z,W)$, the following holds: $(h \circ g) \circ f = h \circ (g \circ f)$.
- **Identity**: For each object $X \in ob(C)$, there exists a unique identity morphism $Id_X \in Hom_C(X,X)$. For any morphism $f \in Hom_C(X,Y)$, we have $Id_Y \circ f = f = f \circ Id_X$.

---

## Types of Morphisms

For a morphism $f \in Hom_C(X,Y)$:

- **Monomorphism**: $f$ is monic if for every object $A$ and any two morphisms $g_1, g_2 \in Hom_C(A,X)$, the equality $f \circ g_1 = f \circ g_2$ implies $g_1 = g_2$.
- **Epimorphism**: $f$ is epic if for every object $A$ and any two morphisms $g_1, g_2 \in Hom_C(Y,A)$, the equality $g_1 \circ f = g_2 \circ f$ implies $g_1 = g_2$.
- **Isomorphism**: $f$ is an isomorphism if there exists a morphism $g \in Hom_C(Y,X)$ such that $f \circ g = Id_Y$ and $g \circ f = Id_X$.
- **Endomorphism**: $f$ is an endomorphism if its domain and codomain are the same object ($X=Y$).
- **Automorphism**: $f$ is an automorphism if it is both an endomorphism and an isomorphism.

---

## Functors

A functor is a structure-preserving map between two categories, C and D.

### Covariant Functor
A covariant functor $\mathcal{F}:C \rightarrow D$ consists of:
- An assignment of each object $X \in ob(C)$ to an object $\mathcal{F}(X) \in ob(D)$.
- An assignment of each morphism $f \in Hom_C(X,Y)$ to a morphism $\mathcal{F}(f) \in Hom_D(\mathcal{F}(X), \mathcal{F}(Y))$ such that:
  - $\mathcal{F}(Id_X) = Id_{\mathcal{F}(X)}$ (preserves identity).
  - $\mathcal{F}(g \circ f) = \mathcal{F}(g) \circ \mathcal{F}(f)$ (preserves composition).

### Contravariant Functor
A contravariant functor $\mathcal{F}:C \rightarrow D$ consists of:
- An assignment of each object $X \in ob(C)$ to an object $\mathcal{F}(X) \in ob(D)$.
- An assignment of each morphism $f \in Hom_C(X,Y)$ to a morphism $\mathcal{F}(f) \in Hom_D(\mathcal{F}(Y), \mathcal{F}(X))$ such that:
  - $\mathcal{F}(Id_X) = Id_{\mathcal{F}(X)}$ (preserves identity).
  - $\mathcal{F}(g \circ f) = \mathcal{F}(f) \circ \mathcal{F}(g)$ (reverses composition).

---

## Properties of Functors

For a functor $\mathcal{F}:C \rightarrow D$:

- **Essentially Surjective**: For every object $Y \in ob(D)$, there exists an object $X \in ob(C)$ such that $\mathcal{F}(X) \cong Y$.
- **Fully Faithful**: For every pair of objects $X, Y \in ob(C)$, the induced map from $Hom_C(X,Y)$ to $Hom_D(\mathcal{F}(X), \mathcal{F}(Y))$ is a bijection.
- **Equivalence**: $\mathcal{F}$ is said to be an equivalence if either of the following (equivalent) conditions holds:
  - There exists a functor $\mathcal{F}': D \rightarrow C$ such that both compositions of $\mathcal{F}$ and $\mathcal{F}'$ are naturally isomorphic to the identity functors (on the corresponding categories); namely $\mathcal{F} \circ \mathcal{F}' \cong Id_D$ and $\mathcal{F}' \circ \mathcal{F} \cong Id_C$. In which case, $\mathcal{F}'$ is said to be a quasi-inverse of F.
  - $\mathcal{F}$ is fully faithful and essentially surjective.

---

## Natural Transformations

A natural transformation is a map between two functors. Given two covariant functors $\mathcal{F}, \mathcal{G} : C \rightarrow D$, a natural transformation $\eta$ from $\mathcal{F}$ to $\mathcal{G}$ is a family of morphisms $\{\eta_X\}_{X \in ob(C)}$ where each $\eta_X \in Hom_D(\mathcal{F}(X), \mathcal{G}(X))$. This family must satisfy the condition that for every morphism $f: X \rightarrow Y$ in C, the following diagram commutes:
$$
\begin{array}{ccc}
\mathcal{F}(X) & \xrightarrow{\mathcal{F}(f)} & \mathcal{F}(Y) \\
\downarrow{\eta_X} & & \downarrow{\eta_Y} \\
\mathcal{G}(X) & \xrightarrow{\mathcal{G}(f)} & \mathcal{G}(Y)
\end{array}
$$
If every $\eta_X$ is an isomorphism in D, then $\eta$ is a **natural isomorphism**.