import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import sanitizeHtml from 'sanitize-html';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EMAIL_ENV_VARS = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_TO'];
const emailConfigured = EMAIL_ENV_VARS.every((v) => process.env[v]);

const transporter = emailConfigured
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : null;

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const { name, email, subject, message } = body ?? {};

    if (!name || name.length < 2) {
      return NextResponse.json(
        { message: "Name must be at least 2 characters" },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!subject || subject.length < 3) {
      return NextResponse.json(
        { message: "Subject must be at least 3 characters" },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!message || message.length < 10) {
      return NextResponse.json(
        { message: "Message must be at least 10 characters long" },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Persist to the admin inbox (primary store).
    let persisted = false;
    try {
      const { error } = await createAdminClient()
        .from('contact_submissions')
        .insert({ name, email, subject, message });
      if (error) throw error;
      persisted = true;
    } catch (e) {
      console.error('contact_submissions insert failed:', e);
    }

    let emailed = false;
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Contact Form" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_TO,
          replyTo: email,
          subject: `New Contact Form: ${subject}`,
          text: `
        New message from your website contact form:

        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
          html: `
        <h2>New message from your website contact form</h2>
        <p><strong>Name:</strong> ${sanitizeHtml(name)}</p>
        <p><strong>Email:</strong> ${sanitizeHtml(email)}</p>
        <p><strong>Subject:</strong> ${sanitizeHtml(subject)}</p>
        <h3>Message:</h3>
        <p>${sanitizeHtml(message.replace(/\n/g, '<br>'))}</p>
        <p><small>Timestamp: ${new Date().toISOString()}</small></p>
      `
        });
        emailed = true;
      } catch (e) {
        console.error('contact email send failed:', e);
      }
    } else {
      console.warn('Contact email skipped: SMTP not configured.');
    }

    if (persisted || emailed) {
      return NextResponse.json(
        { message: "Message sent successfully!" },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json(
      { message: "Failed to send message. Please try again later." },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );

  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      { message: "Failed to send message. Please try again later." },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
