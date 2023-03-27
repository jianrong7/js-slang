import * as es from 'estree'

// import * as create from '../utils/astCreator'
// import { ancestor, make, simple } from '../utils/walkers'
// import GPUBodyVerifier from './verification/bodyVerifier'
// import GPULoopVerifier from './verification/loopVerifier'

class WebGPUTransformer {
  program: es.Program
  device: es.Identifier

  constructor(program: es.Program, device: es.Identifier) {
    this.program = program
    this.device = device
  }
}

export default WebGPUTransformer
