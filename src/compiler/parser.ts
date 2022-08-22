import {
  BinaryOperator,
  VariableDeclarator,
  VariableDeclaration,
  Expression,
  Comments,
  AssignmentExpression,
  ForStatement,
  BinaryExpression,
  CallExpression,
  IdentifierToken,
  Node,
  NumericLiteral,
  NumericLiteralToken,
  Program,
  Token,
  SlashToken,
} from './types';

import {
  KEYWORDS
} from './constants'


export function parser(tokens: Token[]): Program {
  const program: Program = { body: [] };
  let current = 0;
  let identifierParsing = false
  let identifierParsingCase2 = false

  function parse(): Node {
    const token = tokens[current]!;
    const nextToken = tokens[current + 1]!;

    if (nextToken != undefined && nextToken.type == 'EqualsToken') {
      identifierParsingCase2 = true
    }

    if (token.type === 'Identifier') {
      if (token.value == KEYWORDS.log)  { //console.log
          return parseCallExpression(token);
      } else if (token.value == KEYWORDS.var) { // var
          identifierParsing = true
          const varDecl:VariableDeclaration = parseVariableDeclaration(token)
          identifierParsing = false
          return varDecl;
      } else if (token.value == KEYWORDS.forloop) { // for loop
          return parseForExpression(token);
      } else if (identifierParsingCase2) {//i = 20
          identifierParsing = true
          identifierParsingCase2 = false
          const assignExpres:AssignmentExpression = parseAssignmentExpression(token)
          identifierParsing = false
          return assignExpres;
      }
    }

    if (token.type === 'NumericLiteral') {
      const next = tokens[current + 1];
      if (next?.type === 'PlusToken' || next?.type === 'MinusToken' ||
          next?.type === 'AsteriskToken' || next?.type === 'SlashToken' ||
          next?.type === 'PercentToken') {
        return parseBinaryExpression(token, next);
      } else {
        return parseNumericLiteral(token);
      }
    }

    if (token.type === 'Identifier' && identifierParsing) {
      const next = tokens[current + 1];
      if (next?.type === 'PlusToken' || next?.type === 'MinusToken' ||
          next?.type === 'AsteriskToken' || next?.type === 'SlashToken' ||
          next?.type === 'PercentToken') {
        return parseBinaryExpression(token, next);
      } else {
        return parseIdentifier(token);
      }
    }

    if (nextToken.type !== undefined 
        && token.type === 'SlashToken' 
        && nextToken.type === 'SlashToken') { //comments
      return parseSlashToken(token);
    }

    if (token.type === 'NewLineToken') {
      current++
      return { type: "NewLineToken" }
    }
      throw new SyntaxError(`Unknown Token: ${token.type}`);
  }

  function parseSlashToken (token: SlashToken) : Comments {
    current++
    let comments:Comments = { type: 'Comments', block: null, line: null }
    current++
    var line:string = ""
    while (tokens[current]?.type != "NewLineToken") {
      if (tokens[current]?.type == "Identifier") {
        line = line + (<IdentifierToken>tokens[current]).value + " "
      }
      if (tokens[current]?.type == "NumericLiteral") {
        line = line + (<NumericLiteralToken>tokens[current]).value + " "
      }
      current++
    }
    comments.line = line
    return <Comments>comments;
  }

  function parseVariableExpression (token: IdentifierToken, next: BinaryOperator) : AssignmentExpression {
    const left = parseIdentifier(token);

    let binexpr = null;

    if (tokens[current]?.type == 'PlusToken') {
      const type = tokens[current]?.type
      const left = parseIdentifier(<IdentifierToken>tokens[current - 1])
      const retValue = parseNumericLiteral(<NumericLiteralToken>tokens[current]!);
      binexpr = { type: 'BinaryExpression', left: left, operator: { type: type } , right:retValue };
    }

    const assigne = { type: 'AssignmentExpression', operator: "=", left:left, right:binexpr };
    
    return <AssignmentExpression>assigne;
  }

  function parseAssignmentExpression(token: IdentifierToken): AssignmentExpression {
    const left = token;
    current++
    if ((tokens[current]?.type !== 'EqualsToken' && tokens[current]?.type !== 'PlusToken')) {
      throw new SyntaxError('Indentifier must be followed by (');
    }

    current++;

    const right = <Expression>parse();
    return { type: 'AssignmentExpression', operator: "=", left:left, right:right };
  }

  function parseBinaryExpression(token: NumericLiteralToken | IdentifierToken, next: BinaryOperator): BinaryExpression {
    let left, right
    if (token.type == 'NumericLiteral') {
      left = parseNumericLiteral(token);
    } else {
      left = parseIdentifier(token);
    }
    const operator = next
    if (tokens[current]?.type === 'PlusToken') {
      current++
    }
    if (tokens[current] !== undefined && tokens[current]?.type == 'NumericLiteral') {
      right = parse();
    } else if (tokens[current] !== undefined && tokens[current]?.type == 'Identifier')  {
      right = parse();
    } else {
      right = <IdentifierToken>tokens[current - 1]
    }    
    return { type: 'BinaryExpression', left, operator, right };
  }

  function parseBinaryExpressionVariation(token: IdentifierToken, next: BinaryOperator): BinaryExpression {
    const left = token.value;
    const operator = next;
    var right;
    
    if (next.type == 'GreaterThanToken' || next.type == 'LessThanToken') {
        let val = (<NumericLiteralToken>tokens[current]).value
        right = <Node>{ type: 'NumericLiteral', value: val}
    } else {
        current++;
        right = parse();
    }

    return { type: 'BinaryExpression', left:{ type: 'Identifier', value: left }, operator, right: right };
  }

  function parseVariableDeclaration(token: IdentifierToken): VariableDeclaration {
    current++

    let id = tokens[current]
    if (tokens[current + 1]?.type !== 'EqualsToken') {
      throw new SyntaxError('Indentifier must be followed by =');
    }

    let binaryexp: Node
    let variableDeclarator: VariableDeclarator
    current = current + 2

    if (tokens[current + 1] == undefined || tokens[current + 1]?.type != 'PlusToken') {
      if (tokens[current]?.type == 'NumericLiteral') {
        binaryexp = parseNumericLiteral(<NumericLiteralToken>tokens[current]);
      } else {
        binaryexp = parseIdentifier(<IdentifierToken>tokens[current]);
      }
    } else {
      binaryexp = parseBinaryExpression(<IdentifierToken>tokens[current], <BinaryOperator>tokens[++current])
    }
    variableDeclarator = { type: 'VariableDeclarator', id: <IdentifierToken>id, init: binaryexp}
  
    return { type: 'VariableDeclaration', kind:"var", declarations: variableDeclarator}
  }

  function parseCallExpression(token: IdentifierToken): CallExpression {
    const identifier = token;
    current++;

    if (tokens[current]?.type !== 'OpenParenToken') {
      throw new SyntaxError('Indentifier must be followed by (');
    }
    current++;

    let argument: Node;
    if (tokens[current]?.type == "Identifier") {
        identifierParsing = true
        argument = parse();
        identifierParsing = false
    } else {
        argument = parse();
    }

    if (tokens[current]?.type !== 'CloseParenToken') {
      throw new SyntaxError('Call expressions terminate with )');
    }
    current++;

    return { type: 'CallExpression', identifier, argument }
  }

  function parseForExpression(token: IdentifierToken): ForStatement {
    current++;

    if (tokens[current]?.type !== 'OpenParenToken') {
      throw new SyntaxError('Indentifier must be followed by (');
    }

    let nextToken = <IdentifierToken>tokens[++current];

    const init: Node = parseAssignmentExpression(nextToken);
    current++

    nextToken = <IdentifierToken>tokens[current];
    let nextNextToken = <BinaryOperator>tokens[++current];
    current++

    const test: Node = parseBinaryExpressionVariation(nextToken, nextNextToken);
    current++

    nextToken = <IdentifierToken>tokens[++current];
    nextNextToken = <BinaryOperator>tokens[++current];

    current++
  
    const update: Node = parseVariableExpression(nextToken, nextNextToken);
    if (tokens[current]?.type !== 'CloseParenToken') {
      throw new SyntaxError('Call expressions terminate with )');
    }
    current++;

    if (tokens[current]?.type !== 'OpenParenCurlyToken') {
      throw new SyntaxError('Call expressions terminate with )');
    }
    current++;

    let bodyNode:Node[] = []
    while (tokens[current]?.type !== 'CloseParenCurlyToken') {
        bodyNode.push(<Node>parseBody());
    }

    // console.log("bodyNode "+ JSON.stringify(bodyNode))

    if (tokens[current]?.type !== 'CloseParenCurlyToken') {
      throw new SyntaxError('Call expressions terminate with )');
    }
    current++;
  
    return { type: 'ForStatement', init: init, test: test, update: update, body: bodyNode }
  }

  function parseBody() : Node {
    const bodyNode: Node = <Node>parse();
    return bodyNode;
  }

  function parseNumericLiteral(token: NumericLiteralToken): NumericLiteral {
    current++;
    return { type: 'NumericLiteral', value: token.value }
  }

  function parseIdentifier(token: IdentifierToken): IdentifierToken {
    current++;
    return { type: 'Identifier', value: token.value }
  }

  while (current < tokens.length) {
    let node = parse()
    if (node.type != 'NewLineToken') {
      program.body.push(node);
    }
  }

  return program;
}

// var t= 100+j+4
// var k= t+1
// var j= k
// var jj= 1
// var k= jj+j
// console.log(k+1)
// console.log(2+2)
// for(var i=1;i<20;i=i+1){
//   log(2 + 2) console.log(2+2)
// }