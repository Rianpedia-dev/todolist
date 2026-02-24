

Berikut adalah rekomendasi **Tech Stack** dan struktur dasar untuk proyek Anda:

### 🛠️ Tech Stack Dasar

* **Framework Utama:** Next.js (App Router) - *Menangani UI (Frontend) dan API/Server Actions (Backend).*
* **Database Driver:** `mysql2` - *Kita akan menggunakan `mysql2/promise` agar mendukung `async/await` yang cocok dengan ekosistem Next.js.*
* **Database:** MySQL - *Bisa menggunakan XAMPP/Laragon untuk lokal, atau layanan cloud seperti Railway/Aiven.*
* **Styling:** Tailwind CSS - *Sudah menjadi bawaan (default) saat membuat proyek Next.js, sangat cepat untuk merapikan UI.*

---

### 📂 Panduan Setup Cepat & Contoh Kode

Berikut adalah gambaran bagaimana teknologi tersebut digabungkan.

#### 1. Inisialisasi Proyek

Pertama, buat proyek Next.js dan install package database.

```bash
npx create-next-app@latest my-todolist
cd my-todolist
npm install mysql2

```

*(Saat ditanya di terminal, pastikan Anda memilih untuk menggunakan **App Router**).*

#### 2. Konfigurasi Koneksi Database (`lib/db.js`)

Buat folder `lib` di dalam *root* proyek Anda dan tambahkan file `db.js`. Di sinilah `mysql2` bekerja sebagai jembatan ke database MySQL Anda.

```javascript
// lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Sesuaikan dengan user database Anda
  password: '',      // Sesuaikan dengan password database Anda
  database: 'todo_db', // Nama database yang akan dibuat
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

```

#### 3. Membuat Server Actions (`app/actions.js`)

Gunakan Server Actions Next.js untuk memproses data tanpa perlu membuat file API route yang terpisah.

```javascript
// app/actions.js
'use server'

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Fungsi Menambah ToDo
export async function addTodo(formData) {
  const task = formData.get('task');
  if (!task) return;

  try {
    const [result] = await pool.query('INSERT INTO todos (task, is_completed) VALUES (?, ?)', [task, false]);
    revalidatePath('/'); // Refresh halaman otomatis
  } catch (error) {
    console.error("Gagal menambah data:", error);
  }
}

// Fungsi Menghapus ToDo
export async function deleteTodo(id) {
  try {
    await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    revalidatePath('/');
  } catch (error) {
    console.error("Gagal menghapus data:", error);
  }
}

```

#### 4. Menampilkan UI di Frontend (`app/page.js`)

Kita buat halaman utama yang langsung menarik data dari MySQL (sebagai Server Component) dan memiliki form untuk menambah To-Do.

```javascript
// app/page.js
import pool from '@/lib/db';
import { addTodo, deleteTodo } from './actions';

export default async function Home() {
  // Mengambil data langsung dari database
  const [todos] = await pool.query('SELECT * FROM todos ORDER BY id DESC');

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">To-Do List</h1>
      
      {/* Form Tambah Task */}
      <form action={addTodo} className="flex gap-2 mb-6">
        <input 
          type="text" 
          name="task" 
          placeholder="Mau ngapain hari ini?" 
          className="flex-1 border border-gray-300 p-2 rounded text-black"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Tambah
        </button>
      </form>

      {/* Daftar Task */}
      <ul className="space-y-3">
        {todos.map((todo) => (
          <li key={todo.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200">
            <span className="text-gray-700">{todo.task}</span>
            <form action={deleteTodo.bind(null, todo.id)}>
              <button type="submit" className="text-red-500 hover:text-red-700 font-bold">
                X
              </button>
            </form>
          </li>
        ))}
        
        {todos.length === 0 && (
          <p className="text-center text-gray-500 text-sm">Belum ada tugas.</p>
        )}
      </ul>
    </div>
  );
}

```

---

