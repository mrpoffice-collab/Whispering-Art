import { Resend } from 'resend';
import type { Order } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendOrderConfirmation(order: Order) {
  try {
    await resend.emails.send({
      from: 'Whispering Art <noreply@whisperingart.com>',
      to: order.buyerEmail,
      subject: 'Your Whispering Art card is on its way',
      html: generateConfirmationEmail(order),
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    throw error;
  }
}

function generateConfirmationEmail(order: Order): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Georgia', serif;
            color: #4A4A4A;
            background-color: #FAF7F2;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-family: 'Brush Script MT', cursive;
            font-size: 32px;
            color: #C9D5C5;
          }
          .tagline {
            font-size: 14px;
            color: #4A4A4A;
            opacity: 0.7;
            margin-top: 5px;
          }
          .content {
            line-height: 1.6;
          }
          .card-info {
            background-color: #FAF7F2;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .recipient-info {
            background-color: #F2D5D7;
            background-opacity: 0.2;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #C9D5C5;
            font-size: 12px;
            color: #4A4A4A;
            opacity: 0.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Whispering Art</div>
            <div class="tagline">by Nana</div>
          </div>

          <div class="content">
            <p>Dear ${order.buyerName},</p>

            <p>
              Thank you for choosing Whispering Art. Your handcrafted greeting card
              has been received and will be printed and mailed within 1-2 business days.
            </p>

            <div class="card-info">
              <h3 style="margin-top: 0; color: #4A4A4A;">Card Details</h3>
              <p style="margin: 5px 0;"><strong>Occasion:</strong> ${order.cardDesign.intent.occasion}</p>
              <p style="margin: 5px 0;"><strong>Front Caption:</strong> "${order.cardDesign.text.frontCaption}"</p>
              <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.id.slice(-12)}</p>
            </div>

            <div class="recipient-info">
              <h3 style="margin-top: 0; color: #4A4A4A;">Sending To</h3>
              <p style="margin: 5px 0;">${order.recipient.name}</p>
              <p style="margin: 5px 0;">${order.recipient.addressLine1}</p>
              ${order.recipient.addressLine2 ? `<p style="margin: 5px 0;">${order.recipient.addressLine2}</p>` : ''}
              <p style="margin: 5px 0;">
                ${order.recipient.city}, ${order.recipient.state} ${order.recipient.zipCode}
              </p>
            </div>

            <p>
              Each card is created with care and intention. Your recipient will receive
              a beautiful, handcrafted piece that carries your message with quiet beauty.
            </p>

            <p>
              If you have any questions or concerns, please don't hesitate to reach out
              at <a href="mailto:hello@whisperingart.com" style="color: #C9D5C5;">hello@whisperingart.com</a>.
            </p>

            <p style="margin-top: 30px;">
              With warmth,<br/>
              <em style="font-size: 18px; color: #4A4A4A;">Nana</em>
            </p>
          </div>

          <div class="footer">
            <p>Whispering Art by Nana</p>
            <p>Where words and art whisper together</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
