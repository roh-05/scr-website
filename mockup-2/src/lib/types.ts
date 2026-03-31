// src/lib/types.ts

/**
 * Standardizes the response from all Next.js Server Actions.
 * 
 * Either returns success: true and the strictly-typed data,
 * or success: false and a user-friendly error string suitable 
 * for rendering in a toast notification.
 */
export type ActionResponse<T = void> = [T] extends [void]
  ? { success: true; data?: never } | { success: false; error: string }
  : { success: true; data: T } | { success: false; error: string };
