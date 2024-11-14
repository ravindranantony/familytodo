import React, { useState, useRef, useEffect } from 'react';
import { CheckIcon, Trash2Icon, PencilIcon, XIcon } from 'lucide-react';
import { useTodoStore } from '../store/todoStore';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed }) => {
  const { toggleTodo, deleteTodo, updateTodo } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(title);
  };

  const handleSave = async () => {
    if (editedTitle.trim() !== title) {
      await updateTodo(id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 flex-1">
        <button
          onClick={() => toggleTodo(id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {completed && <CheckIcon className="w-4 h-4 text-white" />}
        </button>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-lg px-2 py-1 border-b-2 border-blue-500 focus:outline-none bg-transparent"
            onBlur={handleSave}
          />
        ) : (
          <span
            className={`text-lg ${
              completed ? 'text-gray-400 line-through' : 'text-gray-700'
            }`}
          >
            {title}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <button
            onClick={handleCancel}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => deleteTodo(id)}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Trash2Icon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};