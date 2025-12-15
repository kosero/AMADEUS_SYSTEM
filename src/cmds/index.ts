import * as nya from "./nya.js";
import * as tts from "./tts.js";
import * as register from "./register-cmd.js";

const cmds = {
  [nya.data.name]: nya,
  [tts.data.name]: tts,
  [register.data.name]: register,
};

export default cmds;
