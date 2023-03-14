// import compilerWGSL from '../wgsl-raw/playgpu.wgsl'
import initDevice from './initDevice'

export async function play_gpu(time: number, fs: number, generate: string) {
  const device = await initDevice()
  const k = Math.ceil((time * fs * 1.0) / 128)
  console.log(k)
  const inp = [k, fs]
  const start = performance.now()
  const input = new Float32Array(inp)

  const gpuBufferInput = device.createBuffer({
    mappedAtCreation: true,
    size: input.byteLength,
    usage: GPUBufferUsage.STORAGE
  })
  const arrayBufferInput = gpuBufferInput.getMappedRange()

  new Float32Array(arrayBufferInput).set(input)
  gpuBufferInput.unmap()

  const resultBufferSize = Float32Array.BYTES_PER_ELEMENT * (k * 128)
  const resultBuffer = device.createBuffer({
    size: resultBufferSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
  })

  // Pipeline setup

  const computePipeline = device.createComputePipeline({
    layout: 'auto',
    compute: {
      module: device.createShaderModule({
        code:
          `struct Input {
          k: f32,
          fs: f32,
        }
        
        @group(0) @binding(0) var<storage, read> input : Input;
        @group(0) @binding(1) var<storage, read_write> result : array<f32>;
        
        @compute @workgroup_size(128)
        fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
          for (var i = 0u; i < 16; i = i + 1u) {
            let index = i + global_id.x * u32(input.k);
            let x = f32(index) / f32(input.fs);
            result[index] = ` +
          generate +
          `;}}`
      }),
      entryPoint: 'main'
    }
  })

  // Bind group

  const bindGroup = device.createBindGroup({
    layout: computePipeline.getBindGroupLayout(0 /* index */),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: gpuBufferInput
        }
      },
      {
        binding: 1,
        resource: {
          buffer: resultBuffer
        }
      }
    ]
  })

  // Commands submission

  const commandEncoder = device.createCommandEncoder()

  const passEncoder = commandEncoder.beginComputePass()
  passEncoder.setPipeline(computePipeline)
  passEncoder.setBindGroup(0, bindGroup)
  const workgroupCountX = k
  passEncoder.dispatchWorkgroups(workgroupCountX)
  passEncoder.end()

  // Get a GPU buffer for reading in an unmapped state.
  const gpuReadBuffer = device.createBuffer({
    size: resultBufferSize,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
  })

  // Encode commands for copying buffer to buffer.
  commandEncoder.copyBufferToBuffer(
    resultBuffer /* source buffer */,
    0 /* source offset */,
    gpuReadBuffer /* destination buffer */,
    0 /* destination offset */,
    resultBufferSize /* size */
  )

  // Submit GPU commands.
  const gpuCommands = commandEncoder.finish()
  device.queue.submit([gpuCommands])

  // Read buffer.
  await gpuReadBuffer.mapAsync(GPUMapMode.READ)
  const arrayBuffer = gpuReadBuffer.getMappedRange()
  const end = performance.now()
  console.log(Array.from(new Float32Array(arrayBuffer)))
  return {
    runtime: end - start,
    result: Array.from(new Float32Array(arrayBuffer))
  }
}
