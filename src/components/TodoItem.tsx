
import React, { useState } from 'react';
import { Todo, Priority } from '@/types/todo';
import { useTodo } from '@/context/TodoContext';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Edit, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleComplete, deleteTodo, updateTodo } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [priority, setPriority] = useState<Priority>(todo.priority);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggleComplete = () => {
    if (todo.completed) {
      toggleComplete(todo.id);
      return;
    }
    
    setIsCompleting(true);
    // Delay the actual completion to allow animation to finish
    setTimeout(() => {
      toggleComplete(todo.id);
      setIsCompleting(false);
    }, 500); // Match this to the animation duration
  };

  const handleSave = () => {
    updateTodo(todo.id, { title, description, priority });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const priorityColors = {
    low: 'bg-todo-low/10 border-todo-low text-todo-low',
    medium: 'bg-todo-medium/10 border-todo-medium text-todo-medium',
    high: 'bg-todo-high/10 border-todo-high text-todo-high'
  };

  return (
    <Card 
      className={cn(
        "mb-3 p-4 transition-all duration-300 hover:shadow-md",
        isCompleting && "animate-task-complete",
        todo.completed && "opacity-60"
      )}
    >
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-medium"
            placeholder="Task title"
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none min-h-[80px]"
            placeholder="Add a description (optional)"
          />
          <div className="flex justify-between items-center">
            <Select value={priority} onValueChange={(val: Priority) => setPriority(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <div className="pt-1">
            <Checkbox 
              checked={todo.completed} 
              onCheckedChange={handleToggleComplete}
              className="mt-0.5"
            />
          </div>
          <div className="flex-grow">
            <h3 className={cn("font-medium text-lg mb-1", todo.completed && "line-through text-muted-foreground")}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={cn("text-muted-foreground text-sm mb-2", todo.completed && "line-through")}>
                {todo.description}
              </p>
            )}
            <div className="flex justify-between items-center mt-2">
              <span className={cn("text-xs px-2 py-1 rounded border", priorityColors[todo.priority])}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} priority
              </span>
              <div className="space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  disabled={todo.completed}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TodoItem;
