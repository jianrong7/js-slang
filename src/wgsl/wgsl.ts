import * as es from 'estree'

// import * as create from '../utils/astCreator'
import { getIdentifiersInProgram } from '../utils/uniqueIds'
import { generate } from './generator'
import { play_gpu } from './webgpu/play_gpu'

// top-level gpu functions that call our code

// transpiles if possible and modifies program to a Source program that makes use of the GPU primitives
export function transpileToWebGPU(program: es.Program) {
  const identifiers = getIdentifiersInProgram(program)
  console.log('identifiers:', identifiers)
  const body = program.body
  const node = body[0]
  if (node != undefined) {
    if (node.type == "ExpressionStatement") {
      const node2 = node.expression
      if (node2.type == "CallExpression") {
        const node3 = node2.arguments[0]
        if (node3.type == "ArrowFunctionExpression") {
          const name = getName(node3.params[0])
          const code = generate(node3.body, name)
          console.log(code)
        }
      }
    }
  }
}

function getName(node: es.Node): string {
  if (node.type == "Identifier") {
    return node.name
  }
  return ''
}