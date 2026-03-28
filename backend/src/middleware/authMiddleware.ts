import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/config';

// Initialize Supabase client with service role key (untuk verify token di backend)
const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey
);

/**
 * AUTH MIDDLEWARE - Verify Supabase JWT Token
 * 
 * Middleware ini:
 * 1. Mengambil token dari Authorization header (Bearer <token>)
 * 2. Memverifikasi token dengan public key Supabase
 * 3. Extract user_id dan email dari token
 * 4. Attach user info ke req.user untuk middleware/handler berikutnya
 * 
 * Flow:
 * Request dengan header: Authorization: Bearer <jwt_token>
 *   ↓
 * Extract token dari header
 *   ↓
 * Verify dengan Supabase JWT
 *   ↓
 * Jika valid: req.user = {id, email}, lanjut ke next middleware
 * Jika invalid: Return 401 Unauthorized
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Ambil token dari Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 'error',
        message: 'Missing or invalid Authorization header'
      });
      return;
    }

    const token = authHeader.substring(7); // Hapus "Bearer " prefix

    // 2. Verify token dengan Supabase
    // getUser() akan verify JWT signature dan return user data jika valid
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.warn('[AUTH] Token verification failed:', error?.message);
      res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
      return;
    }

    // 3. Attach user info ke request object
    // Ini akan digunakan oleh middleware/handler berikutnya
    (req as any).user = {
      id: user.id,
      email: user.email,
      createdAt: user.created_at
    };

    console.log('[AUTH] ✅ Token verified for user:', user.email);

    // 4. Lanjut ke middleware/handler berikutnya
    next();
  } catch (error) {
    console.error('[AUTH] Middleware error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};
