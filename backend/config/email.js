const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Send email function
exports.sendEmail = async (options) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            html: options.html || options.text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email error:', error);
        throw new Error('Email could not be sent');
    }
};

// Email templates
exports.emailTemplates = {
    // Welcome email
    welcome: (name) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Our Store!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for registering with us. We're excited to have you on board!</p>
          <p>Start shopping now and enjoy exclusive deals and offers.</p>
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}" class="button">Start Shopping</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `,

    // Password reset email
    passwordReset: (name, resetUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
        .warning { color: #dc2626; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p class="warning">This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `,

    // Order confirmation email
    orderConfirmation: (name, orderNumber, orderTotal, orderUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-details { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Order Confirmed!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for your order! We've received your order and it's being processed.</p>
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Total Amount:</strong> ৳${orderTotal}</p>
          </div>
          <p style="text-align: center;">
            <a href="${orderUrl}" class="button">View Order Details</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
};

module.exports = exports;