
/**
 * Utility functions for security in the application
 */

/**
 * Sanitizes user input to prevent XSS attacks
 * This is a simple implementation - in production, use a library like DOMPurify
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Replace potentially dangerous characters with their HTML entities
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Validates that the input doesn't contain potentially malicious code
 */
export const validateInput = (input: string): boolean => {
  if (!input) return false;
  
  // Check for common script tags or other potentially harmful content
  const dangerousPatterns = [
    /<script>/i,
    /<\/script>/i,
    /javascript:/i,
    /on\w+=/i, // Matches event handlers like onClick=, onLoad=, etc.
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
};
