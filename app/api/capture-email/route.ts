import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { saveEmailToCSV } from '@/lib/emailStorage';
import { saveEmailToDatabase } from '@/lib/emailDatabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    console.log('📧 New email captured:', email);

    // Save to database (production) or CSV (local)
    let isNewEmail = false;
    if (process.env.MONGODB_URI) {
      // Use database in production
      isNewEmail = await saveEmailToDatabase(email, 'popup');
    } else {
      // Use CSV for local development
      isNewEmail = await saveEmailToCSV(email, 'popup');
    }
    
    if (!isNewEmail) {
      // Email already exists, but still send welcome email
      console.log('⚠️ Email already in database, skipping duplicate');
    }

    // Send notification to admin
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email to admin about new subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ALERT_EMAIL || process.env.EMAIL_USER,
      subject: '📬 New Email Subscriber - Portfolio',
      text: `New subscriber: ${email}\n\nTime: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">📬 New Email Subscriber!</h2>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; color: #333;">
              <strong style="color: #2196F3;">Email:</strong> 
              <a href="mailto:${email}" style="color: #2196F3; text-decoration: none;">${email}</a>
            </p>
            <p style="color: #666; margin-top: 20px;">
              Subscribed at: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    });

    // Welcome email to subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '👋 Hey! Thanks for stopping by my portfolio',
      text: `Hey there!\n\nThanks for checking out my portfolio and dropping your email! Honestly, it means a lot that you took the time to explore what I do.\n\nI'm Matthew - a software developer who loves turning coffee into code and ideas into reality. Whether it's building sleek web apps, crafting blockchain solutions, or just geeking out over new tech, I'm all in.\n\nSince you're here, I figured you might be interested in what I'm working on or maybe you've got a project brewing that needs some technical wizardry. Either way, I'm just an email away!\n\nFeel free to hit reply if you want to chat about:\n• A project you're cooking up\n• Collaboration opportunities\n• Tech stuff in general\n• Or literally anything - I'm pretty friendly!\n\nCatch you later,\nMatthew 🚀\n\nP.S. I promise I won't flood your inbox. I'll only reach out when there's something genuinely cool to share!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a;">
          <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">👋 Hey there!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Thanks for stopping by my portfolio</p>
          </div>
          
          <div style="background: #1a1a1a; padding: 40px 30px; border-radius: 0 0 15px 15px;">
            <p style="color: #e0e0e0; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
              Thanks for checking out my portfolio and dropping your email! Honestly, it means a lot that you took the time to explore what I do.
            </p>
            
            <p style="color: #e0e0e0; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
              I'm <strong style="color: #2196F3;">Matthew</strong> - a software developer who loves turning coffee into code and ideas into reality. Whether it's building sleek web apps, crafting blockchain solutions, or just geeking out over new tech, I'm all in. 💻✨
            </p>
            
            <div style="background: rgba(33, 150, 243, 0.1); border-left: 4px solid #2196F3; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="color: #e0e0e0; font-size: 15px; line-height: 1.7; margin: 0 0 15px 0;">
                Since you're here, I figured you might be interested in what I'm working on, or maybe you've got a project brewing that needs some technical wizardry. Either way, <strong style="color: #2196F3;">I'm just an email away!</strong>
              </p>
              
              <p style="color: #b0b0b0; font-size: 14px; margin: 10px 0 5px 0;">Feel free to hit <strong>reply</strong> if you want to chat about:</p>
              <ul style="color: #e0e0e0; margin: 5px 0 0 20px; padding: 0;">
                <li style="margin: 8px 0;">A project you're cooking up 🍳</li>
                <li style="margin: 8px 0;">Collaboration opportunities 🤝</li>
                <li style="margin: 8px 0;">Tech stuff in general 🚀</li>
                <li style="margin: 8px 0;">Or literally anything - I'm pretty friendly! 😄</li>
              </ul>
            </div>
            
            <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #333;">
              <p style="color: #e0e0e0; margin: 5px 0; font-size: 16px;">Catch you later,</p>
              <p style="color: #2196F3; font-size: 22px; font-weight: bold; margin: 10px 0 5px 0;">Matthew 🚀</p>
              <p style="color: #888; margin: 5px 0; font-size: 14px; font-style: italic;">Software Developer | Problem Solver | Coffee Enthusiast</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 8px; text-align: center;">
              <p style="color: #888; font-size: 13px; margin: 0; line-height: 1.6;">
                <strong>P.S.</strong> I promise I won't flood your inbox. I'll only reach out when there's something genuinely cool to share! 
                <span style="color: #2196F3;">🤝</span>
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="https://github.com/Matthew-Ayinde/" style="display: inline-block; margin: 0 10px; color: #2196F3; text-decoration: none; font-size: 14px;">GitHub</a>
              <span style="color: #555;">|</span>
              <a href="https://www.linkedin.com/in/matthew-ayinde-9b4894231/" style="display: inline-block; margin: 0 10px; color: #2196F3; text-decoration: none; font-size: 14px;">LinkedIn</a>
              <span style="color: #555;">|</span>
              <a href="https://x.com/Your_cute_coder" style="display: inline-block; margin: 0 10px; color: #2196F3; text-decoration: none; font-size: 14px;">Twitter</a>
            </div>
          </div>
        </div>
      `,
    });

    console.log('✅ Email capture successful');

    return NextResponse.json({ 
      success: true, 
      message: 'Subscribed successfully!' 
    });

  } catch (error: any) {
    console.error('❌ Email capture error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
