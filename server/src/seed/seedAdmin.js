import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { ensureDefaultAdmin, ensureSeedData } from '../utils/bootstrap.js';

await connectDB();
await ensureDefaultAdmin();
await ensureSeedData();
console.log('Admin and starter data ensured.');
process.exit(0);
