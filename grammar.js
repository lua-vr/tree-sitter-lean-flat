// Flat, lexical grammar for Lean 4, mirroring the scope structure of the
// official syntax highlighter (leanprover/vscode-lean4, syntaxes/lean4.json).
// Lean's term/tactic syntax is user-extensible (macros, notation, elaborators
// can be declared from library code), so this does not attempt to parse that
// structure — it only classifies tokens, exactly like the TextMate grammar
// it mirrors. See README.md for the full rationale and known limitations.

// Copied verbatim from the author's other (unfinished) attempt at a real
// Lean parser (github.com/estradilua/tree-sitter-lean, grammar/term.js,
// "see identFnAux on Basic.lean"). One token for everything identifier-
// shaped: plain names, «guillemet» names, and dotted chains of either
// (`Nat.double`, `h.mp.mpr`, `p.2.1`, `«weird name».foo`) — mirroring
// Lean's actual identifier lexer with a Unicode-letter allowlist (\pL)
// instead of a punctuation blacklist, and excluding λ, Π, Σ, which are
// reserved for notation, not valid in identifiers.
const identRegex = /(?:(?:[[\pL]--λΠΣ]|_[[[0-9_'!?\pL]--λΠΣ][₀-₉][ₐ-ₜ][ᵢ-ᵪ]ⱼ])[[[0-9_'!?\pL]--λΠΣ][₀-₉][ₐ-ₜ][ᵢ-ᵪ]ⱼ]*|«[^»]+»)(?:\.(?:[[_\pL]--λΠΣ][[[0-9_'!?\pL]--λΠΣ][₀-₉][ₐ-ₜ][ᵢ-ᵪ]ⱼ]*|«[^»]+»|[0-9]+))*/;

function commentBody($) {
  return repeat(choice(
    $.block_comment,
    /[^-\/]+/,
    /-[^\/]/,
    /\/[^-]/,
  ));
}

const DEFINITION_KEYWORDS = [
  'theorem', 'show', 'have', 'using', 'haveI', 'from', 'suffices', 'nomatch',
  'nofun', 'no_index', 'def', 'class', 'structure', 'instance', 'elab',
  'set_option', 'initialize', 'builtin_initialize', 'example',
  'inductive_fixpoint', 'inductive', 'coinductive_fixpoint', 'coinductive',
  'termination_by?', 'termination_by', 'decreasing_by', 'partial_fixpoint',
  'axiom', 'universe', 'variable', 'module', 'import all', 'import', 'open',
  'export', 'prelude', 'renaming', 'hiding', 'lemma', 'abbrev', 'opaque',
];

const CONTROL_KEYWORDS = [
  'do', 'by?', 'by', 'let', 'letI', 'let_expr', 'extends', 'mutual', 'mut',
  'where', 'rec', 'fun', 'section', 'namespace', 'end', 'if', 'bif', 'then',
  'else', 'calc', 'matches', 'match_expr', 'match', 'with', 'forall', 'for',
  'while', 'repeat', 'unless', 'until', 'panic!', 'unreachable!', 'assert!',
  'try', 'catch', 'finally', 'return', 'continue', 'break', 'exists',
  'mod_cast', 'exact?%', 'include_str', 'include', 'in', 'omit',
];

const NOTATION_KEYWORDS = [
  'declare_syntax_cat', 'syntax', 'macro_rules', 'macro', 'binop_lazy%',
  'binop%', 'unop%', 'binrel_no_prop%', 'binrel%', 'leftact%', 'rightact%',
  'max_prec', 'leading_parser', 'trailing_parser', 'elab_rules', 'deriving',
  'prefix', 'postfix', 'infixl', 'infixr', 'infix', 'notation',
  'tactic_tag', 'tactic_alt', 'tactic_extension', 'register_tactic_tag',
  'type_of%', 'binder_predicate',
];

const GRIND_SIMP_KEYWORDS = [
  'grind_propagator', 'builtin_grind_propagator', 'grind_pattern',
  'simproc', 'builtin_simproc', 'simproc_pattern%', 'builtin_simproc_pattern%',
  'simproc_decl', 'builtin_simproc_decl', 'dsimproc', 'builtin_dsimproc',
  'dsimproc_decl', 'builtin_dsimproc_decl', 'norm_cast_add_elim',
];

const REGISTRATION_KEYWORDS = [
  'show_panel_widgets', 'show_term', 'seal', 'unseal', 'nat_lit',
  'println!', 'private_decl%', 'declare_config_elab', 'decl_name%',
  'register_error_explanation', 'register_builtin_option', 'register_option',
  'register_parser_alias', 'register_simp_attr', 'register_linter_set',
  'register_label_attr', 'recommended_spelling', 'reportIssue!', 'reprove',
  'run_elab', 'run_cmd', 'run_meta', 'value_of%', 'add_decl_doc', 'json%',
  'dbg_trace',
];

const ERROR_LOG_KEYWORDS = [
  'throwErrorAt', 'throwError', 'throwNamedErrorAt', 'throwNamedError',
  'logNamedWarningAt', 'logNamedWarning', 'logNamedErrorAt', 'logNamedError',
];

const HASH_COMMAND_KEYWORDS = [
  '#print', '#eval', '#eval!', '#reduce', '#synth', '#widget', '#where',
  '#version', '#with_exporting', '#check', '#check_tactic',
  '#check_tactic_failure', '#check_failure', '#check_simp',
  '#discr_tree_key', '#discr_tree_simp_key', '#guard', '#guard_expr',
  '#guard_msgs',
];

const KEYWORDS = [
  ...DEFINITION_KEYWORDS,
  ...CONTROL_KEYWORDS,
  ...NOTATION_KEYWORDS,
  ...GRIND_SIMP_KEYWORDS,
  ...REGISTRATION_KEYWORDS,
  ...ERROR_LOG_KEYWORDS,
  ...HASH_COMMAND_KEYWORDS,
];

const MODIFIERS = [
  'local', 'scoped', 'partial', 'unsafe', 'nonrec', 'public', 'private',
  'protected', 'noncomputable', 'meta',
];

module.exports = grammar({
  name: 'lean',

  extras: $ => [
    /\s/,
    $.line_comment,
    $.block_comment,
    $.doc_comment,
    $.mod_doc_comment,
  ],

  rules: {
    source_file: $ => repeat($._token),

    _token: $ => choice(
      $.invalid,
      $.keyword,
      $.trace_macro,
      $.modifier,
      $.storage_type,
      $.attribute,
      $.string,
      $.char,
      $.number,
      $.identifier,
      $.punctuation,
    ),

    keyword: $ => token(choice(...KEYWORDS)),

    trace_macro: $ => token(/(?:trace_goal|trace)\[[^\]\s]*\]/),

    invalid: $ => token(choice('sorry', 'admit', '#exit')),

    modifier: $ => token(choice(...MODIFIERS)),

    storage_type: $ => token(choice('Prop', 'Type', 'Sort')),

    attribute: $ => token(choice(
      seq('@[', /[^\]\s]*/, ']'),
      seq('attribute', /\s*/, '[', /[^\]\s]*/, ']'),
    )),

    string: $ => token(seq(
      optional(choice('s!', 'm!')),
      '"',
      repeat(choice(/[^"\\]/, /\\./)),
      '"',
    )),

    char: $ => token(choice(
      seq("'", /[^\\']/, "'"),
      seq("'", '\\', /./, "'"),
    )),

    number: $ => token(choice(
      /0[xX][0-9a-fA-F]+/,
      /[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?/,
    )),

    identifier: $ => token(identRegex),

    punctuation: $ => token(/\S/),

    line_comment: $ => token(seq('--', /.*/)),

    block_comment: $ => seq('/-', commentBody($), '-/'),
    doc_comment: $ => seq('/--', commentBody($), '-/'),
    mod_doc_comment: $ => seq('/-!', commentBody($), '-/'),
  },
});
