// just examples without throwing any exception
import { ReservedParam } from './types'
import { BinaryOperator, UnaryOperator } from 'estree'

export function evaluateBinaryExpression(operator: BinaryOperator, left: any, right: any) {
  if (left instanceof ReservedParam || right instanceof ReservedParam) {
    return new ReservedParam("(" + (left instanceof ReservedParam) ? "x" : left.toString() + operator + 
      (right instanceof ReservedParam) ? "x" : right.toString() + ")")
  }
  switch (operator) {
    case '+':
      return left + right
    case '-':
      return left - right
    case '*':
      return left * right
    case '/':
      return left / right
    case '%':
      return left % right
    case '===':
      return left === right
    case '!==':
      return left !== right
    case '<=':
      return left <= right
    case '<':
      return left < right
    case '>':
      return left > right
    case '>=':
      return left >= right
    default:
      return undefined
  }
}

export function evaluateUnaryExpression(operator: UnaryOperator, value: any) {
  if (value instanceof ReservedParam) {
    return new ReservedParam(operator + "x")
  }
  if (operator === '!') {
    return !value
  } else if (operator === '-') {
    return -value
  } else if (operator === 'typeof') {
    return typeof value
  } else {
    return +value
  }
}