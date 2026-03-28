import { Router, Request, Response } from 'express';
import { supabaseService } from '../services/supabase';
import { azureService } from '../services/azure';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole, onlyAdmin, onlyHR, onlyApplicant } from '../middleware/roleMiddleware';
import { AuthRequest, ApiResponse } from '../types';

const router = Router();

/**
 * ==================== PUBLIC ROUTES ====================
 * Tidak perlu authentication
 */

// Health check endpoint (public)
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/v1/login - Verify Supabase JWT token and return user role
 * 
 * This endpoint:
 * 1. Receives JWT token from frontend (obtained from Supabase auth)
 * 2. Verifies token using authMiddleware
 * 3. Queries user role from database
 * 4. Returns user info with role for proper routing
 * 
 * Frontend sends:
 * - Authorization header: "Bearer <jwt_token>"
 * 
 * Backend returns:
 * - { user_id, email, name, role, created_at }
 */
router.post(
  '/login',
  authMiddleware,  // Verify JWT token from Supabase
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const userEmail = (req as any).user?.email;

      // Query user role and info from database
      const result = await supabaseService.select('users', {
        user_id: userId
      });

      if (!result.success || !result.data || result.data.length === 0) {
        console.warn('[LOGIN] User not found in database:', userId);
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }

      const user = result.data[0];
      console.log(`[LOGIN] ✅ ${user.name} (${user.role}) logged in successfully`);

      // Return user info with role
      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          user_id: user.user_id,
          email: user.email,
          name: user.name,
          role: user.role,
          created_at: user.created_at
        }
      });
    } catch (error) {
      console.error('[LOGIN] Error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Login verification failed'
      });
    }
  }
);

// Test Supabase connection (public)
router.get('/health/supabase', async (req: Request, res: Response) => {
  try {
    const result = await supabaseService.testConnection();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: String(error),
    });
  }
});

// Test Azure Storage connection (public)
router.get('/health/azure', async (req: Request, res: Response) => {
  try {
    const result = await azureService.testConnection();
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: String(error),
    });
  }
});

/**
 * ==================== PROTECTED ROUTES ====================
 * Semua route di bawah ini memerlukan:
 * 1. authMiddleware - Verify JWT token
 * 2. (Optional) requireRole/roleMiddleware - Check user role
 * 3. auditMiddleware - Log activity
 */

/**
 * Example: Jobs routes
 */
// GET /api/v1/jobs - List all jobs (any authenticated user bisa akses)
router.get(
  '/jobs',
  authMiddleware,      // Step 2: Verify token
  async (req: AuthRequest, res: Response) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'Jobs fetched (placeholder)',
        data: []
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: String(error)
      });
    }
  }
);

// POST /api/v1/jobs - Create job (only HR or Admin)
router.post(
  '/jobs',
  authMiddleware,             // Step 2: Verify token
  requireRole(['admin', 'hr']),  // Step 3: Check role
  async (req: AuthRequest, res: Response) => {
    try {
      res.status(201).json({
        status: 'success',
        message: 'Job created (placeholder)',
        data: { job_id: 'new-job-123' }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: String(error)
      });
    }
  }
);

// DELETE /api/v1/jobs/:id - Delete job (only Admin)
router.delete(
  '/jobs/:id',
  authMiddleware,        // Step 2: Verify token
  onlyAdmin,            // Step 3: Check if admin only
  async (req: AuthRequest, res: Response) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'Job deleted (placeholder)'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: String(error)
      });
    }
  }
);

/**
 * Example: Candidate/Application routes
 */
// GET /api/v1/me - Get current user profile (only authenticated users)
router.get(
  '/me',
  authMiddleware,     // Step 2: Verify token
  async (req: AuthRequest, res: Response) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'Current user profile (placeholder)',
        data: {
          id: req.user?.id,
          email: req.user?.email,
          role: req.user?.role
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: String(error)
      });
    }
  }
);

// POST /api/v1/applications - Apply for job (only applicants)
router.post(
  '/applications',
  authMiddleware,         // Step 2: Verify token
  onlyApplicant,         // Step 3: Check if applicant only
  async (req: AuthRequest, res: Response) => {
    try {
      res.status(201).json({
        status: 'success',
        message: 'Application submitted (placeholder)',
        data: { application_id: 'app-123' }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: String(error)
      });
    }
  }
);

export default router;
