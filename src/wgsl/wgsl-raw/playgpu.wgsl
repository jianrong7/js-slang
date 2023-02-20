struct Input {
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
    result[index] = 