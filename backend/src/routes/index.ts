import { Router, Request, Response } from 'express';
import { supabaseService } from '../services/supabase';
import { azureService } from '../services/azure';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole, onlyAdmin, onlyHR, onlyApplicant } from '../middleware/roleMiddleware';
import { auditMiddleware } from '../middleware/auditMiddleware';
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
  auditMiddleware,     // Step 1: Log activity
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
  auditMiddleware,            // Step 1: Log activity
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
  auditMiddleware,       // Step 1: Log activity
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
  auditMiddleware,    // Step 1: Log activity
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
  auditMiddleware,        // Step 1: Log activity
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
