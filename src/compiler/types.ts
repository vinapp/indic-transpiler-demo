export type IdentifierToken = { type: 'Identifier', value: string }
export type OpenParenToken = { type: 'OpenParenToken' }
export type CloseParenToken = { type: 'CloseParenToken' }
export type OpenParenCurlyToken = { type: 'OpenParenCurlyToken' }
export type CloseParenCurlyToken = { type: 'CloseParenCurlyToken' }
export type NumericLiteralToken = { type: 'NumericLiteral', value: string }
export type PlusToken = { type: 'PlusToken' }
export type MinusToken = { type: 'MinusToken' }
export type AsteriskToken = { type: 'AsteriskToken' }
export type SlashToken = { type: 'SlashToken'}
export type PercentToken = { type: 'PercentToken' }
export type EqualsToken = { type: 'EqualsToken' }
export type LessThanToken = { type: 'LessThanToken' }
export type GreaterThanToken = { type: 'GreaterThanToken' }
export type SemiColonToken = { type: 'SemiColonToken' }
export type NewLineToken = { type: 'NewLineToken' }

export type Token =
  | IdentifierToken
  | OpenParenToken
  | OpenParenCurlyToken
  | CloseParenCurlyToken
  | CloseParenToken
  | NumericLiteralToken
  | PlusToken
  | MinusToken
  | AsteriskToken
  | SlashToken
  | PercentToken
  | EqualsToken
  | LessThanToken
  | GreaterThanToken
  | SemiColonToken
  | NewLineToken

export type Expression = 
  | LogicalExpression
  | AssignmentExpression
  | BinaryExpression

export type GreaterThanOperator = GreaterThanToken
export type LessThanOperator = LessThanToken
export type AdditiveOperator = PlusToken | MinusToken
export type MultiplicativeOperator = AsteriskToken | SlashToken | PercentToken
export type BinaryOperator = AdditiveOperator | MultiplicativeOperator | GreaterThanOperator | LessThanOperator | EqualsToken

export type Comments = {
  type: 'Comments',
  line: string | null
  block: string | null
}

export type AssignmentExpression = {
  type: 'AssignmentExpression';
  operator: '=' | '*=' | '**=' | '/=' | '%=' | '+=' | '-=' |
      '<<=' | '>>=' | '>>>=' | '&=' | '^=' | '|=';
  left: Expression | Identifier | NumericLiteral;
  right: Expression | Identifier | NumericLiteral;
}

export type LogicalExpression = {
  type: 'LogicalExpression',
  operator: '||' | '&&',
  left: Expression,
  right: Expression
}

export type Identifier = { 
  type: 'Identifier',
  value: string
}

export type NumericLiteral = { 
  type: 'NumericLiteral',
  value: string
}

export type CallExpression = {
  type: 'CallExpression',
  identifier: IdentifierToken,
  argument: Node
}

export type BinaryExpression = {
  type: 'BinaryExpression',
  left: Node,
  right: Node,
  operator: AdditiveOperator | MultiplicativeOperator | GreaterThanOperator | LessThanOperator | EqualsToken
}

export type VariableDeclaration = {
  type: 'VariableDeclaration',
  kind: string
  declarations: VariableDeclarator | null
}

export type VariableDeclarator = {
  type: 'VariableDeclarator'
  id:  IdentifierToken,
  init: Node
}

export type ForStatement = {
  type: 'ForStatement',
  init: Expression | null,
  update: Expression | null,
  test: Expression | null,
  body: Node[]
}

export type Node =
  | NumericLiteral
  | CallExpression
  | BinaryExpression
  | ForStatement
  | Expression
  | Identifier
  | VariableDeclaration
  | Comments
  | NewLineToken

export type Program = {
  body: Node[]
}