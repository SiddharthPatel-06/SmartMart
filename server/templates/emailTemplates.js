function otpTemplate(otp) {
  return `
  <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    </head>
    <body style="background-color: #FFF; padding: 40px; font-family: 'Poppins', Arial, sans-serif;">
      <div style="max-width: 480px; margin: auto; background-color: #121212; border-radius: 10px; padding: 32px; color: #e0e0e0; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
        <h2 style="text-align: center; margin-bottom: 20px;">🔐 OTP Verification</h2>
        <p style="font-size: 14px; line-height: 1.6; text-align: center;">
          Use this one-time password to continue:
        </p>
        <div style="margin: 24px 0; text-align: center;">
          <span style="display: inline-block; background-color: #1f1f1f; padding: 14px 28px; font-size: 22px; font-weight: 600; border-radius: 6px; letter-spacing: 4px; color: #ffffff;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 12px; text-align: center; color: #aaaaaa;">
          This code will expire in 10 minutes.
        </p>
      </div>
    </body>
  </html>
  `;
}

function passwordChangeNotification() {
  return `
  <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    </head>
    <body style="background-color: #FFF; padding: 40px; font-family: 'Poppins', Arial, sans-serif;">
      <div style="max-width: 480px; margin: auto; background-color: #121212; border-radius: 10px; padding: 32px; color: #e0e0e0; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
        <h2 style="text-align: center; margin-bottom: 20px;">✅ Password Changed</h2>
        <p style="font-size: 14px; line-height: 1.6; text-align: center;">
          Your password has been updated successfully.
        </p>
        <p style="font-size: 12px; text-align: center; color: #aaaaaa;">
          If this wasn’t you, contact support immediately.
        </p>
      </div>
    </body>
  </html>
  `;
}

module.exports = { otpTemplate, passwordChangeNotification };
