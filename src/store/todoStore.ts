import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  list_id: string;
}

interface TodoList {
  id: string;
  share_id?: string;
  name: string;
  created_at: string;
}

interface TodoStore {
  todos: Todo[];
  todoList: TodoList | null;
  loading: boolean;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateTodo: (id: string, title: string) => Promise<void>;
  shareTodoList: () => Promise<string>;
}

async function initializeDatabase() {
  try {
    // Create todo_lists table
    const { error: listsError } = await supabase.rpc('create_todo_lists_table');
    if (listsError && !listsError.message.includes('already exists')) {
      console.error('Error creating todo_lists table:', listsError);
    }

    // Create todos table
    const { error: todosError } = await supabase.rpc('create_todos_table');
    if (todosError && !todosError.message.includes('already exists')) {
      console.error('Error creating todos table:', todosError);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  todoList: null,
  loading: false,

  fetchTodos: async () => {
    set({ loading: true });
    try {
      // Get or create the todo list
      let { data: todoList, error: listError } = await supabase
        .from('todo_lists')
        .select('*')
        .limit(1)
        .single();

      if (listError && listError.code === 'PGRST116') {
        // Table might not exist, try to initialize the database
        await initializeDatabase();
        
        // Create initial todo list
        const { data: newList, error: createError } = await supabase
          .from('todo_lists')
          .insert([{ name: 'Family Todo List' }])
          .select()
          .single();

        if (createError) throw createError;
        todoList = newList;
      } else if (listError) {
        throw listError;
      }

      if (!todoList) {
        const { data: newList, error: createError } = await supabase
          .from('todo_lists')
          .insert([{ name: 'Family Todo List' }])
          .select()
          .single();

        if (createError) throw createError;
        todoList = newList;
      }

      const { data: todos, error: todosError } = await supabase
        .from('todos')
        .select('*')
        .eq('list_id', todoList.id)
        .order('created_at', { ascending: false });

      if (todosError) throw todosError;

      set({ todos: todos || [], todoList, loading: false });
    } catch (error: any) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to load todos. Please try again.');
      set({ loading: false });
    }
  },

  addTodo: async (title: string) => {
    const todoList = get().todoList;
    if (!todoList) {
      toast.error('No todo list found');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title, list_id: todoList.id }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ todos: [data, ...state.todos] }));
      toast.success('Todo added successfully');
    } catch (error: any) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add todo');
    }
  },

  toggleTodo: async (id: string) => {
    try {
      const todo = get().todos.find((t) => t.id === id);
      if (!todo) return;

      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
      }));
    } catch (error: any) {
      console.error('Error toggling todo:', error);
      toast.error('Failed to update todo');
    }
  },

  deleteTodo: async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        todos: state.todos.filter((t) => t.id !== id),
      }));
      toast.success('Todo deleted successfully');
    } catch (error: any) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete todo');
    }
  },

  updateTodo: async (id: string, title: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ title })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === id ? { ...t, title } : t
        ),
      }));
      toast.success('Todo updated successfully');
    } catch (error: any) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update todo');
    }
  },

  shareTodoList: async () => {
    const todoList = get().todoList;
    if (!todoList) throw new Error('No todo list found');

    if (todoList.share_id) {
      return todoList.share_id;
    }

    try {
      const shareId = Math.random().toString(36).substring(2, 15);
      const { error } = await supabase
        .from('todo_lists')
        .update({ share_id: shareId })
        .eq('id', todoList.id);

      if (error) throw error;

      set((state) => ({
        todoList: state.todoList ? { ...state.todoList, share_id: shareId } : null,
      }));

      return shareId;
    } catch (error: any) {
      console.error('Error sharing todo list:', error);
      toast.error('Failed to share todo list');
      throw error;
    }
  },
}));