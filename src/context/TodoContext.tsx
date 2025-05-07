
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Todo, Priority } from '@/types/todo';
import { toast } from '@/components/ui/use-toast';

interface TodoContextType {
  todos: Todo[];
  addTodo: (title: string, description?: string, priority?: Priority) => void;
  updateTodo: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  filterByPriority: (priority: Priority | 'all') => Todo[];
  getActiveTodos: () => Todo[];
  getCompletedTodos: () => Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        // Convert string dates back to Date objects
        const todosWithDates = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        setTodos(todosWithDates);
      } catch (error) {
        console.error('Error parsing todos from localStorage:', error);
        toast({
          title: 'Error',
          description: 'Could not load your saved tasks.',
          variant: 'destructive'
        });
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string, description?: string, priority: Priority = 'medium') => {
    if (!title.trim()) return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      priority,
      createdAt: new Date()
    };
    
    setTodos(prevTodos => [newTodo, ...prevTodos]);
    toast({
      title: 'Task added',
      description: 'Your new task has been created.'
    });
  };

  const updateTodo = (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
    toast({
      title: 'Task updated',
      description: 'Your task has been updated.'
    });
  };

  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    toast({
      title: 'Task deleted',
      description: 'Your task has been deleted.'
    });
  };

  const toggleComplete = (id: string) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filterByPriority = (priority: Priority | 'all') => {
    if (priority === 'all') return todos;
    return todos.filter(todo => todo.priority === priority);
  };

  const getActiveTodos = () => todos.filter(todo => !todo.completed);
  
  const getCompletedTodos = () => todos.filter(todo => todo.completed);

  return (
    <TodoContext.Provider value={{ 
      todos, 
      addTodo, 
      updateTodo, 
      deleteTodo, 
      toggleComplete,
      filterByPriority,
      getActiveTodos,
      getCompletedTodos
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
