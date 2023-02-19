import * as es from 'estree'

// import * as create from '../utils/astCreator'
import { getIdentifiersInProgram } from '../utils/uniqueIds'
import { generate } from './generator'

// top-level gpu functions that call our code

// transpiles if possible and modifies program to a Source program that makes use of the GPU primitives
export function transpileToWebGPU(program: es.Program) {
  const identifiers = getIdentifiersInProgram(program)
  console.log('identifiers:', identifiers)
  const body = program.body
  generate(body[0], '')
}
