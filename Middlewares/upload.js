import * as path from "node:path";
import * as crypto from "crypto";

import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), "tmp"));
  },
  filename(req, file, cb) {
    const extName = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extName);
    const suffix = crypto.randomUUID();
    cb(null, `${baseName}__${suffix}${extName}`);
  },
});

export default multer({ storage: storage });
// ========================================================>
