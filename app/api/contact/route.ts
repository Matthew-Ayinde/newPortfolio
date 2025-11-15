import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { saveEmailToCSV } from '@/lib/emailStorage';
import { saveEmailToDatabase } from '@/lib/emailDatabase';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    console.log('📧 Contact form submission received');
    console.log('From:', body.email);
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    // Email to admin
    const adminEmailContent = `
NEW CONTACT FORM SUBMISSION
============================

From: ${body.firstName} ${body.lastName}
Email: ${body.email}
Subject: ${body.subject}

Message:
${body.message}

============================
Sent from: Portfolio Contact Form
Time: ${new Date().toLocaleString()}
    `;
    
    // Email to user (confirmation)
    const userEmailContent = `
Hi ${body.firstName},

Thank you for reaching out! I've received your message and will get back to you as soon as possible.

Here's a copy of your message:

Subject: ${body.subject}
Message: ${body.message}

Best regards,
Matthew Ayinde
Software Developer

---
This is an automated confirmation email from matthewayinde.com
    `;
    
    console.log('📤 Sending emails...');
    
    // Save email to database (production) or CSV (local)
    if (process.env.MONGODB_URI) {
      await saveEmailToDatabase(body.email, 'contact');
    } else {
      await saveEmailToCSV(body.email, 'contact');
    }
    
    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ALERT_EMAIL || process.env.EMAIL_USER,
      replyTo: body.email,
      subject: `📬 New Contact: ${body.subject}`,
      text: adminEmailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">📬 New Contact Form Submission</h2>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 20px;">
              <p style="margin: 5px 0; color: #666;"><strong style="color: #2196F3;">From:</strong> ${body.firstName} ${body.lastName}</p>
              <p style="margin: 5px 0; color: #666;"><strong style="color: #2196F3;">Email:</strong> <a href="mailto:${body.email}" style="color: #2196F3; text-decoration: none;">${body.email}</a></p>
              <p style="margin: 5px 0; color: #666;"><strong style="color: #2196F3;">Subject:</strong> ${body.subject}</p>
            </div>
            <div style="border-top: 2px solid #2196F3; padding-top: 20px; margin-top: 20px;">
              <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${body.message}</p>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
              <p>Sent from Portfolio Contact Form</p>
              <p>Time: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
    });
    
    console.log('✅ Admin email sent');
    
    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: body.email,
      subject: '✅ Thank you for contacting me!',
      text: userEmailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">✅ Thank You for Reaching Out!</h2>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Hi <strong>${body.firstName}</strong>,</p>
            <p style="color: #333; line-height: 1.6;">Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3;">
              <p style="margin: 5px 0; color: #666;"><strong style="color: #2196F3;">Your Subject:</strong> ${body.subject}</p>
              <p style="margin: 15px 0 5px 0; color: #666;"><strong style="color: #2196F3;">Your Message:</strong></p>
              <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${body.message}</p>
            </div>
            
            <p style="color: #333; line-height: 1.6;">I typically respond within 24-48 hours. In the meantime, feel free to check out my <a href="https://github.com/Matthew-Ayinde/" style="color: #2196F3; text-decoration: none;">GitHub</a> or connect with me on <a href="https://www.linkedin.com/in/matthew-ayinde-9b4894231/" style="color: #2196F3; text-decoration: none;">LinkedIn</a>.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #333; margin: 5px 0;"><strong>Best regards,</strong></p>
              <p style="color: #2196F3; font-size: 18px; font-weight: bold; margin: 5px 0;">Matthew Ayinde</p>
              <p style="color: #666; margin: 5px 0;">Software Developer</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
              <p>This is an automated confirmation email.</p>
            </div>
          </div>
        </div>
      `,
    });
    
    console.log('✅ User confirmation email sent');
    
    // Store email in localStorage for visitor tracking
    // This will be handled on the client side
    
    return NextResponse.json({ 
      success: true, 
      message: 'Your message has been sent successfully! Check your email for confirmation.' 
    });
    
  } catch (error: any) {
    console.error('❌ Contact form error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send message. Please try again or email me directly.' 
      },
      { status: 500 }
    );
  }
}
