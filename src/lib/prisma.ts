import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// 1. Grab the URL from your environment
// Note: In production you MUST use the connection pooling URL (port 6543)
// and append ?pgbouncer=true or &pgbouncer=true
const connectionString = `${process.env.DATABASE_URL}`

// 2. Initialize the standard Postgres connection pool
// Constrained to max: 1 to prevent connection exhaustion in serverless environments
const pool = new Pool({ 
  connectionString,
  max: 1 
})

// 3. Wrap it in the Prisma Adapter
const adapter = new PrismaPg(pool)

// 4. Standard Next.js global singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

// 5. Pass the adapter to the new PrismaClient
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma