const initDevice = async () => {
  if (!navigator.gpu) {
    const err =
      "WebGPU is not supported. Please use Chrome Canary and enable #enable-unsafe-webgpu. " +
      "See https://developer.chrome.com/docs/web-platform/webgpu/ for more details.";
    console.error(err);
    throw err;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    const err = "Failed to get GPU adapter.";
    console.error(err);
    throw err;
  }

  const device = await adapter.requestDevice();
  if (!device) {
    const err = "Failed to get GPU device.";
    console.error(err);
    throw err;
  }
  return device;
};

export default initDevice;
