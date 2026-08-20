# tree-sitter-lean-flat

A mostly flat tree-sitter grammar for Lean 4, vibe-coded from previous expertise and the TextMate grammar from the official extension. 

Lean has extensible grammar and is meant to be used with semantic tokens. For proper highliting, please use this in conjunction with it! I wrote semantic token support for Eglot (Emacs' official LSP client) [here](https://github.com/lua-vr/eglot-semtok) which is now upstream.

For a failed attempt at doing the grammar "right", including a whitespace-sensitive `C` scanner, see [tree-sitter-lean-fail](https://github.com/lua-vr/tree-sitter-lean-fail). I learned a couple of things from it, some of which are incorporated here. 

The other tree-sitter Lean grammars that I'm aware fail quite terribly in Mathlib files with notation. Try to add too much structure, and the extensible context-sensitive syntax will bite you in the back.
