
import React from 'react';
import { TodoProvider } from '@/context/TodoContext';
import AddTodoForm from '@/components/AddTodoForm';
import TodoList from '@/components/TodoList';
import CommentSection from '@/components/CommentSection';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <header className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Secure Task Manager
              </h1>
              <p className="text-gray-600">
                Keep track of your tasks and stay productive
              </p>
            </header>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AddTodoForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TodoList />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <CommentSection />
          </motion.div>
        </div>
      </div>
    </TodoProvider>
  );
};

export default Index;
