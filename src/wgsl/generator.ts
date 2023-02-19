import * as es from 'estree'

export function generate(node: es.Node, result: string): string {
  console.log(node)
  // console.log(node.type)
  return result
}
