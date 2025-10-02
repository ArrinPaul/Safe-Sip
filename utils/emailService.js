const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  initialize() {
    // Create transporter based on environment
    if (process.env.NODE_ENV === 'production') {
      // Production email configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } else {
      // Development - use Ethereal Email for testing
      this.createTestAccount();
    }
  }

  async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });

      logger.info('Development email account created', {
        user: testAccount.user,
        pass: testAccount.pass
      });
    } catch (error) {
      logger.error('Failed to create test email account:', error);
    }
  }

  async sendEmail(to, subject, html, text = null) {
    if (!this.transporter) {
      logger.warn('Email transporter not initialized');
      return false;
    }

    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME || 'SafeSip'} <${process.env.FROM_EMAIL || 'noreply@safesip.com'}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV !== 'production') {
        logger.info('Email sent (test)', {
          messageId: result.messageId,
          previewUrl: nodemailer.getTestMessageUrl(result)
        });
      } else {
        logger.info('Email sent', {
          to,
          subject,
          messageId: result.messageId
        });
      }

      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email, firstName) {
    const subject = 'Welcome to SafeSip Health Monitoring System';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SafeSip</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌊 Welcome to SafeSip</h1>
            <p>Your Health Monitoring Journey Begins</p>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Welcome to SafeSip, the comprehensive waterborne disease management and health monitoring system.</p>
            
            <h3>What you can do with SafeSip:</h3>
            <ul>
              <li>🏥 Monitor health statistics and disease outbreaks</li>
              <li>💧 Track water quality in your region</li>
              <li>📊 Access real-time analytics and reports</li>
              <li>🤖 Get AI-powered health predictions</li>
              <li>📱 Use mobile-friendly dashboards</li>
            </ul>

            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">
              Get Started
            </a>

            <p>If you have any questions, our support team is here to help!</p>
            
            <p>Best regards,<br>The SafeSip Team</p>
          </div>
          <div class="footer">
            <p>© 2024 SafeSip Health Monitoring System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(email, subject, html);
  }

  async sendPasswordResetEmail(email, firstName, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset Request - SafeSip';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff6b6b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #ff6b6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>We received a request to reset your SafeSip account password.</p>
            
            <a href="${resetUrl}" class="button">Reset Password</a>
            
            <div class="warning">
              <strong>⚠️ Important:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Never share this link with anyone</li>
              </ul>
            </div>

            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            
            <p>Best regards,<br>The SafeSip Team</p>
          </div>
          <div class="footer">
            <p>© 2024 SafeSip Health Monitoring System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(email, subject, html);
  }

  async sendHealthAlert(email, firstName, alertData) {
    const subject = `Health Alert: ${alertData.type} - SafeSip`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Health Alert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .alert { background: #ffebee; border: 2px solid #e74c3c; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: #e74c3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Health Alert</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            
            <div class="alert">
              <h3>Alert: ${alertData.type}</h3>
              <p><strong>Location:</strong> ${alertData.location}</p>
              <p><strong>Severity:</strong> ${alertData.severity}</p>
              <p><strong>Description:</strong> ${alertData.description}</p>
              <p><strong>Time:</strong> ${new Date(alertData.timestamp).toLocaleString()}</p>
            </div>

            <h3>Recommended Actions:</h3>
            <ul>
              ${alertData.recommendations?.map(rec => `<li>${rec}</li>`).join('') || '<li>Follow standard health protocols</li>'}
            </ul>

            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">
              View Dashboard
            </a>
            
            <p>Please take immediate action if required and consult with health officials.</p>
            
            <p>Stay safe,<br>The SafeSip Team</p>
          </div>
          <div class="footer">
            <p>© 2024 SafeSip Health Monitoring System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(email, subject, html);
  }

  async sendReportNotification(email, firstName, reportData) {
    const subject = `New Report Generated - SafeSip`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Report Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2ecc71; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .report-info { background: white; border: 1px solid #ddd; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .button { display: inline-block; background: #2ecc71; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 New Report Available</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>A new report has been generated and is ready for your review.</p>
            
            <div class="report-info">
              <h3>${reportData.title}</h3>
              <p><strong>Type:</strong> ${reportData.type}</p>
              <p><strong>Period:</strong> ${reportData.period}</p>
              <p><strong>Generated:</strong> ${new Date(reportData.timestamp).toLocaleString()}</p>
              ${reportData.summary ? `<p><strong>Summary:</strong> ${reportData.summary}</p>` : ''}
            </div>

            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reports" class="button">
              View Report
            </a>
            
            <p>Best regards,<br>The SafeSip Team</p>
          </div>
          <div class="footer">
            <p>© 2024 SafeSip Health Monitoring System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(email, subject, html);
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  async verifyConnection() {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();