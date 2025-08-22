// Email service for handover notifications
interface HandoverEmailData {
  handoverNumber: string
  employeeName: string
  employeeEmail: string
  department: string
  handoverType: string
  assetCount: number
}

interface EmailNotification {
  type: 'approval_request' | 'handover_created' | 'handover_approved' | 'handover_rejected'
  handover: HandoverEmailData
  recipientEmail: string
  recipientName: string
  approvalUrl?: string
  rejectionReason?: string
}

export async function sendHandoverNotificationEmail(notification: EmailNotification): Promise<void> {
  // In a real implementation, you would use a service like:
  // - SendGrid
  // - AWS SES
  // - Nodemailer with SMTP
  // - Microsoft Graph API (for Outlook)

  const { type, handover, recipientEmail, recipientName } = notification

  let subject: string
  let htmlContent: string

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const handoverUrl = `${baseUrl}/operations/handovers`

  switch (type) {
    case 'approval_request':
      subject = `[Action Required] Asset Handover Approval - ${handover.handoverNumber}`
      htmlContent = generateApprovalRequestEmail(handover, recipientName, handoverUrl)
      break

    case 'handover_created':
      subject = `Asset Handover Created - ${handover.handoverNumber}`
      htmlContent = generateHandoverCreatedEmail(handover, recipientName, handoverUrl)
      break

    case 'handover_approved':
      subject = `Asset Handover Approved - ${handover.handoverNumber}`
      htmlContent = generateHandoverApprovedEmail(handover, recipientName, handoverUrl)
      break

    case 'handover_rejected':
      subject = `Asset Handover Rejected - ${handover.handoverNumber}`
      htmlContent = generateHandoverRejectedEmail(handover, recipientName, notification.rejectionReason || '', handoverUrl)
      break

    default:
      throw new Error(`Unknown email type: ${type}`)
  }

  try {
    // For development/testing, log the email instead of sending
    console.log(`📧 EMAIL NOTIFICATION:`)
    console.log(`To: ${recipientEmail} (${recipientName})`)
    console.log(`Subject: ${subject}`)
    console.log(`Content Preview: Asset handover ${handover.handoverNumber} for ${handover.employeeName}`)
    console.log(`Full URL: ${handoverUrl}`)
    
    // Store notification in database
    if (typeof prisma !== 'undefined') {
      await prisma.notification.create({
        data: {
          userId: 'system', // In real app, map email to user ID
          title: subject,
          message: `Asset handover notification for ${handover.employeeName}`,
          type: 'handover_notification',
          relatedEntityType: 'asset_handover',
          relatedEntityId: handover.handoverNumber,
          sentViaEmail: true
        }
      })
    }

    // TODO: Replace with actual email sending logic
    // Example with nodemailer:
    /*
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: recipientEmail,
      subject: subject,
      html: htmlContent
    })
    */

  } catch (error) {
    console.error('Failed to send email notification:', error)
    throw error
  }
}

function generateApprovalRequestEmail(handover: HandoverEmailData, recipientName: string, handoverUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; }
        .footer { background: #e9ecef; padding: 15px; border-radius: 0 0 8px 8px; }
        .button { background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 5px; }
        .button.reject { background: #dc3545; }
        .asset-info { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #007bff; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔄 Asset Handover Approval Required</h1>
        </div>
        <div class="content">
          <p>Dear ${recipientName},</p>
          
          <p>A new asset handover request requires your approval:</p>
          
          <div class="asset-info">
            <strong>Handover Number:</strong> ${handover.handoverNumber}<br>
            <strong>Employee:</strong> ${handover.employeeName}<br>
            <strong>Email:</strong> ${handover.employeeEmail}<br>
            <strong>Department:</strong> ${handover.department}<br>
            <strong>Type:</strong> ${handover.handoverType}<br>
            <strong>Number of Assets:</strong> ${handover.assetCount}
          </div>
          
          <p>Please review and approve this handover request:</p>
          
          <a href="${handoverUrl}" class="button">📋 Review Handover</a>
          
          <p><strong>Action Required:</strong> This handover is pending your approval. Please review the details and approve or reject the request.</p>
        </div>
        <div class="footer">
          <p><small>This is an automated notification from the IT Operations System. Please do not reply to this email.</small></p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateHandoverCreatedEmail(handover: HandoverEmailData, recipientName: string, handoverUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; }
        .footer { background: #e9ecef; padding: 15px; border-radius: 0 0 8px 8px; }
        .button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        .asset-info { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #28a745; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Asset Handover Created</h1>
        </div>
        <div class="content">
          <p>Dear ${recipientName},</p>
          
          <p>Your asset handover request has been successfully created and submitted for approval:</p>
          
          <div class="asset-info">
            <strong>Handover Number:</strong> ${handover.handoverNumber}<br>
            <strong>Employee:</strong> ${handover.employeeName}<br>
            <strong>Department:</strong> ${handover.department}<br>
            <strong>Type:</strong> ${handover.handoverType}<br>
            <strong>Number of Assets:</strong> ${handover.assetCount}<br>
            <strong>Status:</strong> Pending Approval
          </div>
          
          <p>Your request has been sent to the appropriate managers for approval. You will receive an email notification once the handover has been reviewed.</p>
          
          <a href="${handoverUrl}" class="button">📋 View Handover Status</a>
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Your manager will review and approve the request</li>
            <li>IT Admin will prepare the assets</li>
            <li>You'll be notified when assets are ready for collection</li>
          </ul>
        </div>
        <div class="footer">
          <p><small>This is an automated notification from the IT Operations System. Please do not reply to this email.</small></p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateHandoverApprovedEmail(handover: HandoverEmailData, recipientName: string, handoverUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; }
        .footer { background: #e9ecef; padding: 15px; border-radius: 0 0 8px 8px; }
        .button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        .asset-info { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #28a745; }
        .success { background: #d4edda; color: #155724; padding: 10px; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Asset Handover Approved</h1>
        </div>
        <div class="content">
          <p>Dear ${recipientName},</p>
          
          <div class="success">
            <strong>Good News!</strong> Your asset handover request has been approved.
          </div>
          
          <div class="asset-info">
            <strong>Handover Number:</strong> ${handover.handoverNumber}<br>
            <strong>Employee:</strong> ${handover.employeeName}<br>
            <strong>Department:</strong> ${handover.department}<br>
            <strong>Type:</strong> ${handover.handoverType}<br>
            <strong>Number of Assets:</strong> ${handover.assetCount}<br>
            <strong>Status:</strong> Approved ✅
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>IT team will prepare your assets</li>
            <li>Assets will be configured and tested</li>
            <li>You'll be contacted to schedule the handover</li>
            <li>Please bring your ID for asset collection</li>
          </ul>
          
          <a href="${handoverUrl}" class="button">📋 View Handover Details</a>
          
          <p>If you have any questions, please contact the IT department.</p>
        </div>
        <div class="footer">
          <p><small>This is an automated notification from the IT Operations System. Please do not reply to this email.</small></p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateHandoverRejectedEmail(handover: HandoverEmailData, recipientName: string, rejectionReason: string, handoverUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 20px; }
        .footer { background: #e9ecef; padding: 15px; border-radius: 0 0 8px 8px; }
        .button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        .asset-info { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #dc3545; }
        .rejection { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Asset Handover Rejected</h1>
        </div>
        <div class="content">
          <p>Dear ${recipientName},</p>
          
          <p>Unfortunately, your asset handover request has been rejected:</p>
          
          <div class="asset-info">
            <strong>Handover Number:</strong> ${handover.handoverNumber}<br>
            <strong>Employee:</strong> ${handover.employeeName}<br>
            <strong>Department:</strong> ${handover.department}<br>
            <strong>Type:</strong> ${handover.handoverType}<br>
            <strong>Number of Assets:</strong> ${handover.assetCount}<br>
            <strong>Status:</strong> Rejected ❌
          </div>
          
          ${rejectionReason ? `
          <div class="rejection">
            <strong>Rejection Reason:</strong><br>
            ${rejectionReason}
          </div>
          ` : ''}
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Review the rejection reason above</li>
            <li>Contact your manager or IT department for clarification</li>
            <li>You may submit a new handover request if needed</li>
          </ul>
          
          <a href="${handoverUrl}" class="button">📋 View Handover Details</a>
          
          <p>If you need assistance or have questions about this rejection, please contact the IT department or your manager.</p>
        </div>
        <div class="footer">
          <p><small>This is an automated notification from the IT Operations System. Please do not reply to this email.</small></p>
        </div>
      </div>
    </body>
    </html>
  `
}