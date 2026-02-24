import { getTodos, addTodo, deleteTodo, toggleTodo } from './actions';
import { Trash2, CheckCircle2, Circle, Plus } from 'lucide-react';

export default async function Home() {
  const todos = await getTodos();

  return (
    <main className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#1e293b] mb-2 tracking-tight">
            My Todo List
          </h1>
          <p className="text-[#64748b] text-lg">Kelola tugas harian Anda dengan mudah.</p>
        </div>

        {/* Form Section */}
        <div className="bg-white p-2 rounded-2xl shadow-xl border border-[#e2e8f0] mb-8">
          <form action={addTodo} className="flex gap-2">
            <input
              type="text"
              name="task"
              placeholder="Apa yang ingin Anda kerjakan hari ini?"
              className="flex-1 px-6 py-4 rounded-xl text-[#334155] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/30"
            >
              <Plus size={20} />
              Tambah
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${todo.is_completed
                    ? 'bg-emerald-50/50 border-emerald-100'
                    : 'bg-white border-[#e2e8f0] hover:border-blue-200 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <form action={toggleTodo.bind(null, todo.id, todo.is_completed)}>
                    <button
                      type="submit"
                      className={`transition-colors ${todo.is_completed ? 'text-emerald-500' : 'text-[#cbd5e1] hover:text-blue-400'
                        }`}
                    >
                      {todo.is_completed ? (
                        <CheckCircle2 size={26} className="fill-emerald-50" />
                      ) : (
                        <Circle size={26} />
                      )}
                    </button>
                  </form>
                  <span
                    className={`text-lg transition-all ${todo.is_completed
                        ? 'text-[#64748b] line-through italic'
                        : 'text-[#334155] font-medium'
                      }`}
                  >
                    {todo.task}
                  </span>
                </div>

                <form action={deleteTodo.bind(null, todo.id)}>
                  <button
                    type="submit"
                    className="p-2 text-[#94a3b8] hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </form>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#cbd5e1]">
              <div className="bg-[#f1f5f9] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} className="text-[#94a3b8]" />
              </div>
              <h3 className="text-[#475569] font-semibold text-xl mb-1">Wah, masih kosong!</h3>
              <p className="text-[#94a3b8]">Belum ada tugas hari ini. Ayo mulai produktif!</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {todos.length > 0 && (
          <div className="mt-8 flex justify-center gap-4 text-sm font-medium">
            <div className="bg-white px-4 py-2 rounded-full border border-[#e2e8f0] text-[#64748b] shadow-sm">
              Total: {todos.length}
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 text-emerald-600 shadow-sm">
              Selesai: {todos.filter((t) => t.is_completed).length}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
