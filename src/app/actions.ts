'use server'

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getTodos() {
    try {
        const [rows] = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
        return rows as any[];
    } catch (error) {
        console.error('SERVER ACTION ERROR (getTodos):', error);
        return [];
    }
}

export async function addTodo(formData: FormData) {
    const task = formData.get('task') as string;
    if (!task || task.trim() === '') return;

    try {
        await pool.execute('INSERT INTO todos (task) VALUES (?)', [task]);
        revalidatePath('/');
    } catch (error) {
        console.error('SERVER ACTION ERROR (addTodo):', error);
    }
}

export async function deleteTodo(id: number) {
    try {
        await pool.execute('DELETE FROM todos WHERE id = ?', [id]);
        revalidatePath('/');
    } catch (error) {
        console.error('SERVER ACTION ERROR (deleteTodo):', error);
    }
}

export async function toggleTodo(id: number, currentStatus: boolean) {
    try {
        await pool.execute('UPDATE todos SET is_completed = ? WHERE id = ?', [!currentStatus, id]);
        revalidatePath('/');
    } catch (error) {
        console.error('SERVER ACTION ERROR (toggleTodo):', error);
    }
}
