import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request) {
  const body = await request.json();
  const { message, email } = body;

  if (!message) {
    return NextResponse.json(
      { message: 'Message is required' },
      { status: 400 }
    );
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      replyTo: email || undefined,
      subject: 'Website Feedback',
      text: `Message: ${message}\nFrom: ${email || 'No email provided'}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #4A90E2;">📩 New Website Feedback</h2>
        
        <div style="margin-top: 20px;">
          <p style="font-size: 16px; color: #333;"><strong>Message:</strong></p>
          <div style="background-color: #fff; padding: 12px 16px; border-left: 4px solid #4A90E2; border-radius: 4px; color: #444;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
    
        <div style="margin-top: 20px;">
          <p style="font-size: 16px; color: #333;"><strong>From:</strong></p>
          <p style="font-size: 15px; color: #555; margin-left: 10px;">${email || 'No email provided'}</p>
        </div>
    
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
        
        <p style="font-size: 13px; color: #888; text-align: center;">This feedback was sent from your website's contact form.</p>
      </div>
    `
    });

    return NextResponse.json(
      { message: 'Feedback sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);

    return NextResponse.json(
      { message: 'Failed to send feedback' },
      { status: 500 }
    );
  }
}