// Adapter layer (so you can swap storage later).
import { fileStorage } from "./fileStorage";
export const db = fileStorage;
// In future: replace with vercel-kv/vercel-postgres etc.