import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

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

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
