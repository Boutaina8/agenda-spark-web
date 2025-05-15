
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { sanitizeInput, validateInput } from '@/utils/securityUtils';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle } from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  timestamp: Date;
}

const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
    if (error) setError('');
  };

  const addComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    // Validate comment for malicious content
    if (!validateInput(newComment)) {
      setError('Invalid comment content detected. Please remove any HTML or script tags.');
      toast({
        title: 'Security Warning',
        description: 'Potentially harmful content was blocked.',
        variant: 'destructive'
      });
      return;
    }
    
    // Sanitize the comment before adding it
    const sanitizedComment = sanitizeInput(newComment);
    
    const comment: Comment = {
      id: crypto.randomUUID(),
      text: sanitizedComment,
      timestamp: new Date()
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setError('');
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      
      <Card className="p-4 mb-6">
        <form onSubmit={addComment} className="space-y-3">
          <Input
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Add a comment..."
            className="w-full"
          />
          
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <Button type="submit">Post Comment</Button>
        </form>
      </Card>
      
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <Card key={comment.id} className="p-4">
              <div className="mb-2 text-sm text-muted-foreground">
                {comment.timestamp.toLocaleString()}
              </div>
              <div className="break-words">
                {/* 
                  Note: Using dangerouslySetInnerHTML would be risky here.
                  We're using simple text rendering which is safe after sanitization.
                */}
                {comment.text}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
