import { Pool } from 'pg'

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
})

export const query = async (text: string, params?: any[]) => {
    const start = Date.now()
    try {
        const res = await pool.query(text, params)
        const duration = Date.now() - start
        console.log('Executed query', { text, duration, rows: res.rowCount })
        return res
    } catch (error) {
        console.error('Error executing query', { text, error })
        throw error
    }
}

export const getClient = () => {
    return pool.connect()
} 