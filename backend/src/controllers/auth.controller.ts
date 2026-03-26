import { Request, Response } from 'express';
import { supabaseService } from '../services/supabase';
import { RegisterRequest, UserWithoutPassword } from '../types/index';
import { hashPassword, comparePassword } from '../utils/password';

export const authController = {
  // Register endpoint
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body as RegisterRequest;

      // Validasi input tidak boleh kosong
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'name, email, dan password tidak boleh kosong',
        });
      }

      // Cek apakah email sudah ada di tabel users
      console.log(`[REGISTER] Checking if email ${email} already exists...`);
      const { data: existingUsers, success: selectSuccess } = await supabaseService.select(
        'users',
        { email }
      );

      if (!selectSuccess) {
        console.error('[REGISTER] Error checking email existence');
        return res.status(500).json({
          success: false,
          message: 'Error saat memeriksa email',
        });
      }

      if (existingUsers && existingUsers.length > 0) {
        console.log(`[REGISTER] Email ${email} already registered`);
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
        });
      }

      // Insert user ke tabel users dengan role "applicant"
      console.log(`[REGISTER] Inserting new user with email ${email}...`);
      
      // Hash password sebelum simpan ke database
      const hashedPassword = await hashPassword(password);
      
      const newUser = {
        name: name,
        email: email,
        password: hashedPassword,
        role: 'applicant',
        is_active: true,
      };

      const { data: insertedData, success: insertSuccess } = await supabaseService.insert(
        'users',
        newUser
      );

      if (!insertSuccess) {
        console.error('[REGISTER] Error inserting user to database');
        return res.status(500).json({
          success: false,
          message: 'Error saat mendaftarkan user',
        });
      }

      // Return response sukses tanpa password
      console.log(`[REGISTER] User ${email} registered successfully`);
      const userWithoutPassword: UserWithoutPassword = {
        user_id: insertedData[0].user_id,
        name: insertedData[0].name,
        email: insertedData[0].email,
        role: insertedData[0].role,
        is_active: insertedData[0].is_active,
        created_at: insertedData[0].created_at,
      };

      res.status(201).json({
        success: true,
        message: 'User berhasil didaftarkan',
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error('[REGISTER] Unexpected error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.DEBUG === 'true' ? String(error) : undefined,
      });
    }
  },

  // Login endpoint
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validasi input tidak boleh kosong
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'email dan password tidak boleh kosong',
        });
      }

      // Cari user berdasarkan email
      console.log(`[LOGIN] Checking user with email ${email}...`);
      const { data: user, success: selectSuccess, notFound } = await supabaseService.selectSingle(
        'users',
        { email }
      );

      if (!selectSuccess) {
        if (notFound) {
          console.log(`[LOGIN] User with email ${email} not found`);
          return res.status(400).json({
            success: false,
            message: 'User not found',
          });
        }
        console.error('[LOGIN] Error querying user from database');
        return res.status(500).json({
          success: false,
          message: 'Error saat login',
        });
      }

      // Check password menggunakan bcrypt.compare
      console.log(`[LOGIN] Comparing password for user ${email}...`);
      const isPasswordValid = await comparePassword(password, user.password);
      
      if (!isPasswordValid) {
        console.log(`[LOGIN] Password mismatch for user ${email}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Check if user is active
      if (!user.is_active) {
        console.log(`[LOGIN] User ${email} is inactive`);
        return res.status(400).json({
          success: false,
          message: 'User is inactive',
        });
      }

      // Return response sukses tanpa password
      console.log(`[LOGIN] User ${email} logged in successfully`);
      const userWithoutPassword: UserWithoutPassword = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
      };

      res.status(200).json({
        success: true,
        message: 'Login berhasil',
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error('[LOGIN] Unexpected error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.DEBUG === 'true' ? String(error) : undefined,
      });
    }
  },
};
