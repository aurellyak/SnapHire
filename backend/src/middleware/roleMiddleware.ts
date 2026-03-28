import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/config';

// Initialize Supabase client
const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey
);

/**
 * ROLE MIDDLEWARE - Check User Role from Database
 * 
 * Middleware ini:
 * 1. Mengambil user_id dari req.user (dari authMiddleware)
 * 2. Query role user dari tabel 'users'
 * 3. Compare role dengan allowed roles untuk endpoint ini
 * 4. Jika role sesuai: lanjut ke handler
 * 5. Jika role tidak sesuai: Return 403 Forbidden
 * 
 * Usage:
 * router.post('/jobs', authMiddleware, requireRole(['admin', 'hr']), createJob);
 * 
 * Artinya: Hanya admin dan hr yang boleh akses /jobs POST
 */

export const requireRole = (allowedRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 1. Ambil user_id dari req.user (sudah verified oleh authMiddleware)
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          status: 'error',
          message: 'User not authenticated'
        });
        return;
      }

      // 2. Query role dari tabel 'users'
      const { data: userData, error } = await supabase
        .from('users')
        .select('role, name')
        .eq('user_id', userId)
        .maybeSingle(); // Ambil 1 row atau null

      if (error || !userData) {
        console.warn('[ROLE] User not found in database:', userId);
        res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
        return;
      }

      const userRole = userData.role?.toLowerCase();

      // 3. Compare role dengan allowed roles
      const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
      const hasPermission = normalizedAllowedRoles.includes(userRole);

      if (!hasPermission) {
        console.warn(
          `[ROLE] Access denied for user ${userData.name} (${userRole}). Required: ${allowedRoles.join(', ')}`
        );
        res.status(403).json({
          status: 'error',
          message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
        });
        return;
      }

      // 4. Attach role dan name ke request untuk handler gunakan
      (req as any).user = {
        ...(req as any).user,
        role: userRole,
        name: userData.name
      };

      console.log(`[ROLE] ✅ ${userData.name} (${userRole}) authorized`);

      // 5. Lanjut ke handler
      next();
    } catch (error) {
      console.error('[ROLE] Middleware error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Role verification failed'
      });
    }
  };
};

/**
 * Convenience middleware untuk check multiple specific roles
 * Example: onlyAdmin, onlyHR, onlyApplicant
 */
export const onlyAdmin = requireRole(['admin']);
export const onlyHR = requireRole(['hr']);
export const onlyApplicant = requireRole(['applicant']);
export const onlyHROrAdmin = requireRole(['hr', 'admin']);
