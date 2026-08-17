# tree-sitter-lean-flat

A [tree-sitter](https://tree-sitter.github.io/tree-sitter/) mostly flat grammar for
Lean 4, vibe-coded from previous expertise and the TextMate grammar from the official extension. 

Lean has extensible grammar and is meant to be used with semantic tokens. I wrote semantic token support for Eglot (Emacs' official LSP client) [here](https://github.com/lua-vr/eglot-semtok) which is now upstream. Please use it!

For a failed attempt at doing the grammar "right", see [tree-sitter-lean-fail](https://github.com/lua-vr/tree-sitter-lean-fail). I learned many things from it, some of which are incorporated here. 

Or see the other tree-sitter grammars on GitHub, all of which fail quite terribly in Mathlib files with notation. Try to add too much structure, and the extensible context-sensitive syntax will bite you in the back.
