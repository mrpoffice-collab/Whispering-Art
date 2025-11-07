import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

// Initialize database tables
export async function initDatabase() {
  try {
    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        card_design_id TEXT NOT NULL,
        card_design JSONB NOT NULL,
        buyer_name TEXT NOT NULL,
        buyer_email TEXT NOT NULL,
        recipient JSONB NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        stripe_payment_id TEXT,
        amount INTEGER NOT NULL,
        postage INTEGER NOT NULL DEFAULT 73,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        printed_at TIMESTAMP,
        mailed_at TIMESTAMP
      )
    `;

    // Create index on status for faster filtering
    await sql`
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)
    `;

    // Create index on created_at for sorting
    await sql`
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC)
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
