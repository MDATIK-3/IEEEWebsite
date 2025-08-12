import { NextResponse } from 'next/server';
import nodemailer, { Transporter } from 'nodemailer';
import sanitizeHtml from 'sanitize-html';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';

const requiredEnvVars = [
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_SECURE',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'EMAIL_TO',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface PartnershipRequest {
  organizationName: string;
  organizationType: string;
  contactPerson: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  partnershipType: string;
  projectDescription: string;
  duration?: string;
  budget?: string;
  objectives: string;
  benefits?: string;
  timeline?: string;
  additionalInfo?: string;
}

const generateCsrfToken = (): string => randomBytes(32).toString('hex');

const validateCsrfToken = async (request: Request): Promise<boolean> => {
  const cookieStore = cookies();
  const csrfToken = request.headers.get('X-CSRF-Token');
  const sessionCsrfToken = (await cookieStore).get('csrfToken')?.value;
  return csrfToken === sessionCsrfToken;
};

const sanitizeInput = (input: string | undefined): string => {
  if (!input) return 'Not provided';
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

export async function POST(request: Request) {
  try {
    if (!(await validateCsrfToken(request))) {
      return NextResponse.json({ message: 'Invalid CSRF token' }, { status: 403 });
    }

    let body: PartnershipRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const {
      organizationName,
      organizationType,
      contactPerson,
      email,
      phone,
      website,
      address,
      partnershipType,
      projectDescription,
      duration,
      budget,
      objectives,
      benefits,
      timeline,
      additionalInfo,
    } = body;

    if (!organizationName || organizationName.trim().length < 2) {
      return NextResponse.json({ message: 'Organization name must be at least 2 characters' }, { status: 400 });
    }

    if (!organizationType) {
      return NextResponse.json({ message: 'Please select an organization type' }, { status: 400 });
    }

    if (!contactPerson || contactPerson.trim().length < 2) {
      return NextResponse.json({ message: 'Contact person name must be at least 2 characters' }, { status: 400 });
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ message: 'Please provide a valid email address' }, { status: 400 });
    }

    if (phone && !/^\+?[\d\s-]{7,}$/.test(phone)) {
      return NextResponse.json({ message: 'Please provide a valid phone number' }, { status: 400 });
    }

    if (website && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(website)) {
      return NextResponse.json({ message: 'Please provide a valid URL' }, { status: 400 });
    }

    if (!partnershipType) {
      return NextResponse.json({ message: 'Please select a partnership type' }, { status: 400 });
    }

    if (!projectDescription || projectDescription.trim().length < 50) {
      return NextResponse.json({ message: 'Project description must be at least 50 characters' }, { status: 400 });
    }

    if (!objectives || objectives.trim().length < 10) {
      return NextResponse.json({ message: 'Partnership objectives must be at least 10 characters' }, { status: 400 });
    }

    const zonedDate = toZonedTime(new Date(), 'UTC');
    const submissionDate = format(zonedDate, 'PPpp zzz');

    await transporter.sendMail({
      from: `"Partnership Application" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: sanitizeInput(email),
      subject: `New Partnership Application - ${sanitizeInput(organizationName)}`,
      text: `
New Partnership Application from IEEE GUB Website

ORGANIZATION INFORMATION:
Organization Name: ${sanitizeInput(organizationName)}
Organization Type: ${sanitizeInput(organizationType)}
Address: ${sanitizeInput(address)}

CONTACT INFORMATION:
Contact Person: ${sanitizeInput(contactPerson)}
Email: ${sanitizeInput(email)}
Phone: ${sanitizeInput(phone)}
Website: ${sanitizeInput(website)}

PARTNERSHIP DETAILS:
Partnership Type: ${sanitizeInput(partnershipType)}
Expected Duration: ${sanitizeInput(duration)}
Budget Range: ${sanitizeInput(budget)}

PROJECT DESCRIPTION:
${sanitizeInput(projectDescription)}

PARTNERSHIP OBJECTIVES:
${sanitizeInput(objectives)}

MUTUAL BENEFITS:
${sanitizeInput(benefits)}

PROPOSED TIMELINE:
${sanitizeInput(timeline)}

ADDITIONAL INFORMATION:
${sanitizeInput(additionalInfo)}

Application submitted on: ${submissionDate}
      `,
      html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; background: #f8fafc; padding: 20px;">
  <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🤝 New Partnership Application</h1>
      <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">IEEE Student Branch - Green University of Bangladesh</p>
    </div>
    <div style="padding: 30px;">
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 3px solid #10b981; padding-bottom: 10px;">
          🏢 Organization Information
        </h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981;">
          <p style="margin: 0 0 10px 0;"><strong style="color: #374151;">Organization:</strong> <span style="color: #1f2937;">${sanitizeInput(organizationName)}</span></p>
          <p style="margin: 0 0 10px 0;"><strong style="color: #374151;">Type:</strong> <span style="color: #1f2937;">${sanitizeInput(organizationType)}</span></p>
          <p style="margin: 0;"><strong style="color: #374151;">Address:</strong> <span style="color: #1f2937;">${sanitizeInput(address)}</span></p>
        </div>
      </div>
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 3px solid #10b981; padding-bottom: 10px;">
          👤 Contact Information
        </h2>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; border-left: 4px solid #0ea5e9;">
          <p style="margin: 0 0 10px 0;"><strong style="color: #374151;">Contact Person:</strong> <span style="color: #1f2937;">${sanitizeInput(contactPerson)}</span></p>
          <p style="margin: 0 0 10px 0;"><strong style="color: #374151;">Email:</strong> <a href="mailto:${sanitizeInput(email)}" style="color: #0ea5e9; text-decoration: none;">${sanitizeInput(email)}</a></p>
          <p style="margin: 0 0 10px 0;"><strong style="color: #374151;">Phone:</strong> <span style="color: #1f2937;">${sanitizeInput(phone)}</span></p>
          <p style="margin: 0;"><strong style="color: #374151;">Website:</strong> <span style="color: #1f2937;">${sanitizeInput(website)}</span></p>
        </div>
      </div>
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 3px solid #10b981; padding-bottom: 10px;">
          🤝 Partnership Details
        </h2>
        <div style="background: #fef3e2; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0 0 10px 0;"><strong style="color: #374151;">Partnership Type:</strong> <span style="color: #1f2937;">${sanitizeInput(partnershipType)}</span></p>
          <p style="margin: 0 0 10px 0;"><strong style="color: #374151;">Duration:</strong> <span style="color: #1f2937;">${sanitizeInput(duration)}</span></p>
          <p style="margin: 0;"><strong style="color: #374151;">Budget Range:</strong> <span style="color: #1f2937;">${sanitizeInput(budget)}</span></p>
        </div>
      </div>
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 3px solid #10b981; padding-bottom: 10px;">
          📋 Project Description
        </h2>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; border-left: 4px solid #22c55e;">
          <p style="color: #1f2937; line-height: 1.6; margin: 0; white-space: pre-wrap;">${sanitizeInput(projectDescription)}</p>
        </div>
      </div>
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 3px solid #10b981; padding-bottom: 10px;">
          🎯 Partnership Objectives
        </h2>
        <div style="background: #fef7ff; padding: 20px; border-radius: 12px; border-left: 4px solid #a855f7;">
          <p style="color: #1f2937; line-height: 1.6; margin: 0; white-space: pre-wrap;">${sanitizeInput(objectives)}</p>
        </div>
      </div>
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 3px solid #10b981; padding-bottom: 10px;">
          ⭐ Mutual Benefits
        </h2>
        <div style="background: #fffbeb; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
          <p style="color: #1f2937; line-height: 1.6; margin: 0; white-space: pre-wrap;">${sanitizeInput(benefits)}</p>
        </div>
      </div>
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 3px solid #10b981; padding-bottom: 10px;">
          📅 Proposed Timeline
        </h2>
        <div style="background: #ecfdf5; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981;">
          <p style="color: #1f2937; line-height: 1.6; margin: 0; white-space: pre-wrap;">${sanitizeInput(timeline)}</p>
        </div>
      </div>
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 3px solid #10b981; padding-bottom: 10px;">
          📝 Additional Information
        </h2>
        <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; border-left: 4px solid #64748b;">
          <p style="color: #1f2937; line-height: 1.6; margin: 0; white-space: pre-wrap;">${sanitizeInput(additionalInfo)}</p>
        </div>
      </div>
      <div style="background: #f8fafc; padding: 20px; border-radius: 12px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
          📅 Application submitted on: <strong>${submissionDate}</strong>
        </p>
        <p style="color: #64748b; font-size: 14px; margin: 0;">
          This application was submitted through the IEEE GUB website partnership form.
        </p>
      </div>
    </div>
  </div>
  <div style="margin-top: 20px; text-align: center; padding: 20px; background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
    <h3 style="color: #1f2937; margin: 0 0 15px 0;">Next Steps:</h3>
    <p style="color: #64748b; margin: 0 0 20px 0; font-size: 14px;">
      Please review this application and respond within 3-5 business days.
    </p>
    <div style="display: inline-flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
      <a href="mailto:${sanitizeInput(email)}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        📧 Reply to Applicant
      </a>
      <a href="mailto:ieee@gub.edu.bd" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        💬 Discuss Internally
      </a>
    </div>
  </div>
</div>
      `,
    });

    const cookieStore = await cookies();
    cookieStore.delete('csrfToken');

    return NextResponse.json({ message: 'Partnership application submitted successfully!' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Partnership application error:', {
        message: error.message,
        stack: error.stack,
        body: await request.text().catch(() => 'Failed to parse body'),
      });

      if (error.message.includes('Invalid request body')) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
      }

      if (error.message.includes('Failed to send email')) {
        return NextResponse.json({ message: 'Failed to send email. Please try again later.' }, { status: 500 });
      }
    } else {
      console.error('Unknown error:', error);
    }

    return NextResponse.json({ message: 'Failed to submit partnership application. Please try again later.' }, { status: 500 });
  }
}

export async function GET() {
  const csrfToken = generateCsrfToken();
  const cookieStore = await cookies();
  cookieStore.set('csrfToken', csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60,
  });

  return NextResponse.json({ csrfToken });
}
