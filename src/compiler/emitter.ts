import {
  ForStatement,
  VariableDeclaration,
  BinaryExpression,
  CallExpression,
  NumericLiteral,
  Program,
  Node,
  IdentifierToken,
  AssignmentExpression,
  NewLineToken,
  Comments
} from './types';

import {
  KEYWORDS
} from './constants'

export function emitter(program: Program): string {
  function emit(node: Node): string {
    switch (node.type) {
      case 'NumericLiteral':
        return emitNumericLiteralOrLiteral(node);
      case 'Identifier':
          return emitNumericLiteralOrLiteral(node);
      case 'BinaryExpression':
        return emitBinaryExpression(node);
      case 'CallExpression':
        return emitCallExpression(node);
      case 'VariableDeclaration':
        return emitVariableDeclaration(node);
      case 'ForStatement':
        return emitForStatment(node);
      case 'AssignmentExpression':
        return emitAssignmentExpression(node);
      case 'Comments':
        return emitComments(node);
      case 'NewLineToken':
        return emitNewLine(node);
      default:
        throw new SyntaxError('Unknown Node');
    }
  }

  function emitNumericLiteralOrLiteral(node: NumericLiteral | IdentifierToken) {
    return node.value;
  }

  function emitNewLine(node: NewLineToken) {
    return "\n"
  }

  // { 
  //   "type": "Comments",
  //   "block": null,
  //   "line": "for loop example "
  // }
  function emitComments(node: Comments) {
    return "//" + node.line;
  }

  // {
  //   "type": "AssignmentExpression",
  //   "operator": "=",
  //   "left": { "type": "Identifier", "value": "k" },
  //   "right": { "type": "NumericLiteral", "value": "1" }
  // }
  function emitAssignmentExpression(node: AssignmentExpression) {
    let operator = node.operator
    return `${emit(node.left)}` + operator + `${emit(node.right)}`;
  }

  // {
  //   "type": "CallExpression",
  //   "identifier": { "type": "Identifier", "value": "log" },
  //   "argument": {
  //     "type": "BinaryExpression",
  //     "left": { "type": "NumericLiteral", "value": "1" },
  //     "operator": { "type": "PlusToken" },
  //     "right": { "type": "NumericLiteral", "value": "1" }
  //   }
  // }
  function emitBinaryExpression(node: BinaryExpression) {
    let operator:string = ""; 
    if (node.operator.type === 'PlusToken') {
        operator = '+'
    } else if (node.operator.type === 'MinusToken') {
        operator = '-'
    }  else if (node.operator.type === 'AsteriskToken') {
        operator = '*'
    }  else if (node.operator.type === 'SlashToken') {
        operator = '/'
    }  else if (node.operator.type === 'PercentToken') {
        operator = '%'
    }
    return `${emit(node.left)}` + operator + `${emit(node.right)}`;
  }

  // {
  //   "type": "CallExpression",
  //   "identifier": { "type": "Identifier", "value": "log" },
  //   "argument": { "type": "NumericLiteral", "value": "1" }
  // }
  function emitCallExpression(node: CallExpression) {
    if (node.identifier.value === KEYWORDS.log) {
      return `console.log(${emit(node.argument)})`;
    } else {
      throw new SyntaxError(`Unknown Identifier in call expression: ${node.identifier}`);
    }
  }


  
  // {
  //   "type": "ForStatement",
  //   "init": {
  //     "type": "AssignmentExpression",
  //     "operator": "=",
  //     "left": { "type": "Identifier", "value": "i" },
  //     "right": { "type": "NumericLiteral", "value": "1" }
  //   },
  //   "test": {
  //     "type": "BinaryExpression",
  //     "left": { "type": "Identifier", "value": "i" },
  //     "operator": { "type": "LessThanToken" },
  //     "right": { "type": "NumericLiteral", "value": "20" }
  //   },
  //   "update": {
  //     "type": "AssignmentExpression",
  //     "operator": "=",
  //     "left": { "type": "Identifier", "value": "i" },
  //     "right": {
  //       "type": "BinaryExpression",
  //       "left": { "type": "Identifier", "value": "i" },
  //       "operator": { "type": "PlusToken" },
  //       "right": { "type": "NumericLiteral", "value": "1" }
  //     }
  //   },
  //   "body": [
  //     { "type": "NewLineToken" },
  //     {
  //       "type": "CallExpression",
  //       "identifier": { "type": "Identifier", "value": "log" },
  //       "argument": {
  //         "type": "BinaryExpression",
  //         "left": { "type": "NumericLiteral", "value": "2" },
  //         "operator": { "type": "PlusToken" },
  //         "right": { "type": "NumericLiteral", "value": "2" }
  //       }
  //     },
  //     { "type": "NewLineToken" }
  //   ]
  // }  
  function emitForStatment(node: ForStatement) {
    if (node.type === 'ForStatement') {
      let initvar, initval;
      if (node.init?.type === 'AssignmentExpression') {
        if (node.init.left.type === 'Identifier') {
            initvar = node.init.left.value
        }
        if (node.init.right.type === 'NumericLiteral') {
          initval = node.init.right.value
        }
      }
      let testvar, testvaroper, testval;
      if (node.test?.type === 'BinaryExpression') {
        if (node.test.left.type === 'Identifier') {
          testvar = node.test.left.value
        }
        if (node.test.operator.type === 'LessThanToken') {
          testvaroper = "<"
        }
        if (node.test.right.type === 'NumericLiteral') {
          testval = node.test.right.value
        }
      }
      let updatevar, update1varoper, update1var, updatenumvar, update2varoper;
      if (node.update?.type === 'AssignmentExpression') {
        if (node.update.left.type === 'Identifier') {
          updatevar = node.update.left.value
        }
        update1varoper = node.update.operator
        if (node.update.right.type === 'BinaryExpression') {
          if (node.update.right.left.type === 'Identifier') {
            update1var = node.update.right.left.value
          }
          if (node.update.right.right.type === 'NumericLiteral') {
            updatenumvar = node.update.right.right.value
          }
          if (node.update.right.operator.type === 'PlusToken') {
            update2varoper = "+"
          }
        }
      }
      let body:String[] = []
      let len = 0;
      while(len < node.body.length) {
        let bodyItem = node.body[len]
        if (bodyItem?.type === 'CallExpression') {
          body.push(emitCallExpression(bodyItem))
        } else if (bodyItem?.type === 'VariableDeclaration') {
          body.push(emitVariableDeclaration(bodyItem))
        } else if (bodyItem?.type === 'AssignmentExpression') {
          body.push(emitAssignmentExpression(bodyItem))
        }
        len++
      }
      const forstmt = "for(" + initvar + "=" + initval + ";" + testvar + testvaroper 
                           + testval + ";" + updatevar + update1varoper + update1var + update2varoper
                           + updatenumvar + ")" + "{\n\t" + body.toLocaleString().replaceAll(",", "\n\t") + "\n}"

      return forstmt;
    } else {
        throw new SyntaxError(`Unknown Identifier in call expression: ${node.type}`);
    }
  }

  // {
  //   "type": "VariableDeclaration",
  //   "kind": "var",
  //   "declarations": {
  //     "type": "VariableDeclarator",
  //     "id": { "type": "Identifier", "value": "t" },
  //     "init": { "type": "Identifier", "value": "i" }
  //   }
  // }

  // {
  //   "type": "VariableDeclaration",
  //   "kind": "var",
  //   "declarations": {
  //     "type": "VariableDeclarator",
  //     "id": { "type": "Identifier", "value": "t" },
  //     "init": {
  //       "type": "BinaryExpression",
  //       "left": { "type": "NumericLiteral", "value": "1" },
  //       "operator": { "type": "PlusToken" },
  //       "right": {
  //         "type": "BinaryExpression",
  //         "left": { "type": "Identifier", "value": "i" },
  //         "operator": { "type": "PlusToken" },
  //         "right": { "type": "NumericLiteral", "value": "3" }
  //       }
  //     }
  //   }
  // }
  function emitVariableDeclaration(node: VariableDeclaration) {
    let variable, leftval, rightval
    if (node.kind === 'var') {
      if (node.declarations?.id.type == 'Identifier') {
        variable = node.declarations?.id.value
      }
      if (node.declarations?.init.type == 'Identifier') {
        leftval = node.declarations?.init.value
      }
      if (node.declarations?.init.type == 'NumericLiteral') {
        leftval = node.declarations?.init.value
      }
      if (node.declarations?.init.type == 'BinaryExpression') {
        let right = node.declarations?.init.right
        let left = node.declarations?.init.left
        while (right) {
            if (left.type == "Identifier") {
              if (leftval!=undefined) {
                leftval = leftval + "+" + left.value
              } else {
                leftval = left.value
              }
            }
            if (left.type == "NumericLiteral") {
              if (leftval!=undefined) {
                leftval = leftval + "+" + left.value
              } else {
                leftval = left.value
              }
            }
            if (right.type == "Identifier") {
              if (rightval != undefined) {
                rightval = rightval + "+" + right.value
              } else {
                rightval = right.value
              }
            }
            if (right.type == "NumericLiteral") {
              if (rightval != undefined) {
                rightval = rightval + "+" + right.value
              } else {
                rightval = right.value
              }
            }
            left = (<BinaryExpression>right).left
            right = (<BinaryExpression>right).right
        }
      }
      if (rightval != undefined) {
        return "var " + variable + "= " + leftval + "+" + rightval;
      } else {
        return "var " + variable + "= " + leftval;
      }
      
    } else {
        throw new SyntaxError(`Unknown Identifier in call expression: ${node.kind}`);
    }
  }

  const output: string[] = [];
  // console.log("program body ---> "+ JSON.stringify(program.body))
  for (const node of program.body) {
    console.log("node --> "+ JSON.stringify(node))
    console.log("emit node --> " + emit(node))
    output.push(emit(node));
  }
  return output.join('\n');
}