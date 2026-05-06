'use server';

import { cookies } from 'next/headers';

// 1. Handle Login & Set Secure Cookie
export async function loginAction(password) {
  if (password === process.env.ADMIN_PASSWORD) {
    // Set an HTTP-only cookie that expires in 1 day
    cookies().set('ieee_session', 'authenticated', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    return { success: true };
  }
  return { success: false, error: "Incorrect password. Please try again." };
}

// 2. Handle Logout
export async function logoutAction() {
  cookies().delete('ieee_session');
}

// 3. Securely Fetch Data from Google Apps Script
export async function fetchAdminData() {
  const session = cookies().get('ieee_session');
  
  if (!session || session.value !== 'authenticated') {
    throw new Error("Unauthorized");
  }

  // Append the secret key to the URL securely on the server
  const url = `${process.env.GAS_WEB_APP_URL}?secret=${process.env.GAS_API_SECRET}`;
  
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
    throw new Error("Failed to load data from the database.");
  }
}