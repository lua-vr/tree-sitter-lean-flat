(line_comment) @comment
(block_comment) @comment
(doc_comment) @comment.documentation
(mod_doc_comment) @comment.documentation

(keyword) @keyword
(modifier) @keyword.modifier
(trace_macro) @keyword

(invalid) @error

(storage_type) @type.builtin

(attribute) @attribute

(string) @string
(char) @character
(number) @number

(identifier) @variable
(punctuation) @punctuation.delimiter

(
  (keyword) @_definition_keyword
  .
  (identifier) @function.definition
  (#any-of? @_definition_keyword
    "def" "theorem" "lemma" "abbrev" "instance" "structure"
    "class" "inductive" "coinductive" "axiom" "example" "opaque")
)
