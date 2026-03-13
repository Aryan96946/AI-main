import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging
import secrets
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)

def send_otp_email(receiver_email: str, otp: str, expiry_minutes: int = 5) -> bool:
    """
    Send an OTP email using Gmail SMTP.

    Args:
        receiver_email (str): Recipient email address.
        otp (str): One-time password code.
        expiry_minutes (int, optional): Expiration time of OTP in minutes. Defaults to 5.

    Returns:
        bool: True if email sent successfully, False otherwise.
    """
    sender_email = os.environ.get("GMAIL_SENDER")
    app_password = os.environ.get("GMAIL_APP_PASSWORD")

    if not sender_email or not app_password:
        logging.error("GMAIL_SENDER or GMAIL_APP_PASSWORD not set in environment variables.")
        return False

    # Create email
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "AI Dropout System Verification Code"
    msg["From"] = sender_email
    msg["To"] = receiver_email

    # Plain text and HTML versions
    text = f"Your verification code is {otp}. It will expire in {expiry_minutes} minutes."
    html = f"""
    <html>
        <body>
            <p>Hello,<br><br>
               Your verification code for the AI Dropout System is: <b>{otp}</b><br>
               It will expire in {expiry_minutes} minutes.<br><br>
               If you did not request this code, please ignore this email.
            </p>
        </body>
    </html>
    """

    # Attach parts
    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    # Send email with retry
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, app_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())
        logging.info(f"OTP sent successfully to {receiver_email}")
        return True
    except smtplib.SMTPAuthenticationError:
        logging.error("SMTP Authentication Error: Check your Gmail credentials or App Password.")
        return False
    except smtplib.SMTPRecipientsRefused:
        logging.error(f"Recipient refused: {receiver_email}")
        return False
    except Exception as e:
        logging.error(f"Error sending OTP email: {e}")
        return False


def send_password_reset_email(receiver_email: str, reset_token: str) -> bool:
    """
    Send a password reset email with a reset link.

    Args:
        receiver_email (str): Recipient email address.
        reset_token (str): Password reset token.

    Returns:
        bool: True if email sent successfully, False otherwise.
    """
    sender_email = os.environ.get("GMAIL_SENDER")
    app_password = os.environ.get("GMAIL_APP_PASSWORD")

    if not sender_email or not app_password:
        logging.error("GMAIL_SENDER or GMAIL_APP_PASSWORD not set in environment variables.")
        return False

    # Get the frontend URL from environment or use default
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"

    # Create email
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "AI Dropout System - Password Reset Request"
    msg["From"] = sender_email
    msg["To"] = receiver_email

    # Plain text and HTML versions
    text = f"Click the following link to reset your password: {reset_link}\n\nThis link will expire in 30 minutes."
    html = f"""
    <html>
        <body>
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #10b981;">AI Dropout System - Password Reset</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to reset it:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #3b82f6;">{reset_link}</p>
                <p style="color: #666; font-size: 12px;">This link will expire in 30 minutes.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">If you didn't request a password reset, please ignore this email.</p>
            </div>
        </body>
    </html>
    """

    # Attach parts
    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    # Send email with retry
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, app_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())
        logging.info(f"Password reset email sent successfully to {receiver_email}")
        return True
    except smtplib.SMTPAuthenticationError:
        logging.error("SMTP Authentication Error: Check your Gmail credentials or App Password.")
        return False
    except smtplib.SMTPRecipientsRefused:
        logging.error(f"Recipient refused: {receiver_email}")
        return False
    except Exception as e:
        logging.error(f"Error sending password reset email: {e}")
        return False
