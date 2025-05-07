
import React, { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import TodoItem from './TodoItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Priority } from '@/types/todo';
import { AnimatePresence, motion } from 'framer-motion';

const TodoList: React.FC = () => {
  const { todos, getActiveTodos, getCompletedTodos, filterByPriority } = useTodo();
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  const activeTodos = getActiveTodos();
  const completedTodos = getCompletedTodos();

  const filteredActiveTodos = priorityFilter === 'all' 
    ? activeTodos 
    : activeTodos.filter(todo => todo.priority === priorityFilter);

  const filteredCompletedTodos = priorityFilter === 'all'
    ? completedTodos
    : completedTodos.filter(todo => todo.priority === priorityFilter);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">My Tasks</h2>
        <Select value={priorityFilter} onValueChange={(val: Priority | 'all') => setPriorityFilter(val)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">
            Active <span className="ml-1 text-xs bg-primary/10 px-2 py-0.5 rounded-full">{filteredActiveTodos.length}</span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <span className="ml-1 text-xs bg-primary/10 px-2 py-0.5 rounded-full">{filteredCompletedTodos.length}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-2">
          {filteredActiveTodos.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No active tasks found.</p>
          )}
          {filteredActiveTodos.map(todo => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TodoItem todo={todo} />
            </motion.div>
          ))}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-2">
          {filteredCompletedTodos.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No completed tasks found.</p>
          )}
          {filteredCompletedTodos.map(todo => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TodoItem todo={todo} />
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default TodoList;
