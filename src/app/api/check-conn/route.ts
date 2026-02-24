import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
    try {
        const connection = await pool.getConnection();
        // Menambahkan timeout 5 detik agar aplikasi tidak hang jika DB tidak merespons
        const [rows] = await connection.query<RowDataPacket[]>({
            sql: 'SELECT 1 + 1 AS result',
            timeout: 5000
        });
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
