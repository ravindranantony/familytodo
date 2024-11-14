import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ListTodoIcon, Share2Icon } from 'lucide-react';
import { useTodoStore } from './store/todoStore';
import { TodoItem } from './components/TodoItem';
import { ShareModal } from './components/ShareModal';

function App() {
  const [newTodo, setNewTodo] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const { todos, loading, fetchTodos, addTodo, shareTodoList } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await addTodo(newTodo);
    setNewTodo('');
  };

  const handleShare = async () => {
    try {
      const shareId = await shareTodoList();
      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error('Failed to share todo list:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <ListTodoIcon className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">Family Todo List</h1>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Share2Icon className="w-5 h-5" />
            <span>Share List</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No todos yet. Add one above!
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                title={todo.title}
                completed={todo.completed}
              />
            ))
          )}
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
      />
    </div>
  );
}

export default App;