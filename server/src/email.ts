// In a real application, you would use a library like nodemailer to send emails.
// For this example, we'll just log the email to the console.

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `http://localhost:8080/reset-password?token=${token}`;
  console.log(`
    ================================================
    Password Reset Email (Mock)
    ================================================
    To: ${email}
    Subject: Reset Your Password

    Click the link below to reset your password:
    ${resetLink}

    This link will expire in 1 hour.

    If you did not request a password reset, please ignore this email.
    ================================================
  `);
  return Promise.resolve();
}
