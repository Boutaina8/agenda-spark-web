
import React, { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Priority } from '@/types/todo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, AlertTriangle } from 'lucide-react';
import { sanitizeInput, validateInput } from '@/utils/securityUtils';
import { toast } from '@/components/ui/use-toast';

const AddTodoForm: React.FC = () => {
  const { addTodo } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isExpanded, setIsExpanded] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    
    // Clear previous validation errors when user starts typing again
    if (validationError) setValidationError('');
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    
    // Clear previous validation errors when user starts typing again
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs before submission
    if (!title.trim()) {
      setValidationError('Task title cannot be empty');
      return;
    }
    
    // Check for potentially malicious input
    if (!validateInput(title) || !validateInput(description)) {
      setValidationError('Invalid input detected. Please remove any HTML or script tags.');
      toast({
        title: 'Security Warning',
        description: 'Potentially harmful content was blocked.',
        variant: 'destructive'
      });
      return;
    }
    
    // Sanitize inputs before adding to the todo list
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedDescription = sanitizeInput(description);
    
    addTodo(sanitizedTitle, sanitizedDescription, priority);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setIsExpanded(false);
    setValidationError('');
  };

  const handleTitleFocus = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setIsExpanded(false);
    setValidationError('');
  };

  return (
    <Card className="mb-6 p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Add a new task..."
          onFocus={handleTitleFocus}
          className="font-medium"
          aria-invalid={!!validationError}
        />
        
        {validationError && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>{validationError}</span>
          </div>
        )}
        
        {isExpanded && (
          <>
            <Textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Add a description (optional)"
              className="resize-none min-h-[80px]"
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
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
    </Card>
  );
};

export default AddTodoForm;
