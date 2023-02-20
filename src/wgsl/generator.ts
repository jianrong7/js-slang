import * as es from 'estree'

const builtIn: Map<string, string> = new Map()
builtIn.set('math_abs', 'abs')
builtIn.set('math_acos', 'acos')
builtIn.set('math_acosh', 'acosh')
builtIn.set('math_asin', 'asin')
builtIn.set('math_asinh', 'asinh')
builtIn.set('math_atan', 'atan')
builtIn.set('math_atanh', 'atanh')
builtIn.set('math_ceil', 'ceil')
builtIn.set('math_cos', 'cos')
builtIn.set('math_cosh', 'cosh')
builtIn.set('math_exp', 'exp')
builtIn.set('math_floor', 'floor')
builtIn.set('math_max', 'max')
builtIn.set('math_log2', 'log2')
builtIn.set('math_log', 'log')
builtIn.set('math_min', 'min')
builtIn.set('math_pow', 'pow')
builtIn.set('math_sin', 'sin')
builtIn.set('math_sinh', 'sinh')
builtIn.set('math_sqrt', 'sqrt')
builtIn.set('math_tan', 'tan')
builtIn.set('math_tanh', 'tanh')

export function generate(node: es.Node, paramName: string): string {
  console.log('Node!:', node)
  if (node == undefined) {
    return ''
  }
  switch (node.type) {
    case 'ExpressionStatement':
      return generate(node.expression, paramName)
    case 'CallExpression':
      return generate(node.callee, paramName) + '(' + getArg(node.arguments, paramName) + ')'
    case 'Identifier':
      if (node.name == paramName) {
        return 'x'
      }
      const funName = builtIn.get(node.name)
      if (funName == undefined) {
        return ''
      }
      return funName
    case 'BinaryExpression':
      return generate(node.left, paramName) + node.operator + generate(node.right, paramName)
    case 'Literal':
      if (typeof node.value == "number") {
        return node.value.toString()
      } else {
        return ''
      }
    default:
      return ''
  }
}

function getArg(args: Array<es.Node>, paramName: string) {
  let result = ''
  for (let i = 0; i < args.length - 1; i++) {
    result += generate(args[i], paramName)
    result += ','
  }
  result += generate(args[args.length - 1], paramName)
  return result
}
