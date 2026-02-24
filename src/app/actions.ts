'use server'

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getTodos() {
    try {
        // Ensure table exists
        await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task TEXT NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        const [rows] = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
        return rows as any[];
    } catch (error) {
        console.error('Failed to fetch todos:', error);
        return [];
    }
}

export async function addTodo(formData: FormData) {
    const task = formData.get('task') as string;
    if (!task || task.trim() === '') return;

    try {
        await pool.query('INSERT INTO todos (task) VALUES (?)', [task]);
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to add todo:', error);
    }
}

export async function deleteTodo(id: number) {
    try {
        await pool.query('DELETE FROM todos WHERE id = ?', [id]);
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to delete todo:', error);
    }
}

export async function toggleTodo(id: number, currentStatus: boolean) {
    try {
        await pool.query('UPDATE todos SET is_completed = ? WHERE id = ?', [!currentStatus, id]);
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to toggle todo:', error);
    }
}
