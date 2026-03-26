import { Router, Request, Response } from 'express';
import { supabaseService } from '../services/supabase';
import { azureService } from '../services/azure';
import { authController } from '../controllers/auth.controller';

const router = Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Test Supabase connection
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

// Test Azure Storage connection
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

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

export default router;
