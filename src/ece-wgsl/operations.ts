// just examples without throwing any exception
import { ReservedParam } from './types'
import { BinaryOperator, UnaryOperator } from 'estree'

export function evaluateBinaryExpression(operator: BinaryOperator, left: any, right: any) {
  if (left instanceof ReservedParam || right instanceof ReservedParam) {
    return new ReservedParam("(" + left.toString() + operator + right.toString() + ")")
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
    return new ReservedParam(operator + "(" + value.value + ")")
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

export function applySpecial(functionName: string, args: any[]) {
  let str: string = functionName + "("
  for (let index = 0; index < args.length - 1; index++) {
    str += args[index].toString() + ","
  }
  str += args[args.length - 1] + ")"
  return new ReservedParam(str)
}