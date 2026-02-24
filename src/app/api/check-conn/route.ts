import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query<RowDataPacket[]>('SELECT 1 + 1 AS result');
        connection.release();

        return NextResponse.json({
            status: 'success',
            message: 'Database connection is healthy',
            data: {
                timestamp: new Date().toISOString(),
                test_query: rows[0],
            }
        });
    } catch (error: any) {
        console.error('Database connection check failed:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message,
        }, { status: 500 });
    }
}
