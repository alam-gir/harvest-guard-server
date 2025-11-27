// src/types/express/index.d.ts
import { JwtRole } from "../../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        role: JwtRole;
        sessionId: string;
      };
    }
  }
}

// We need at least one export or import in a .d.ts file in some setups,
// but we already imported JwtRole, so this file is a module.
