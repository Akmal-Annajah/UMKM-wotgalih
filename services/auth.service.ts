import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, { message: "Nama lengkap minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export async function loginWithEmail(data: LoginFormData) {
  const supabase = createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return authData;
}

export async function registerWithEmail(data: RegisterFormData) {
  const supabase = createClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        role: 'umkm',
      }
    }
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return authData;
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export async function requestPasswordReset(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePassword(password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(error.message);
  }
}
