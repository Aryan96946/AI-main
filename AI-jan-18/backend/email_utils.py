import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

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


def send_password_reset_email(receiver_email: str, reset_code: str, expiry_minutes: int = 15) -> bool:
    """
    Send a password reset email with a reset code.

    Args:
        receiver_email (str): Recipient email address.
        reset_code (str): Password reset code.
        expiry_minutes (int, optional): Expiration time of reset code in minutes. Defaults to 15.

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
    msg["Subject"] = "AI Dropout System - Password Reset"
    msg["From"] = sender_email
    msg["To"] = receiver_email

    # Plain text and HTML versions
    text = f"Your password reset code is {reset_code}. It will expire in {expiry_minutes} minutes."
    html = f"""
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; background-color: #1f2937; color: #ffffff; margin: 0; padding: 20px; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: #374151; border-radius: 12px; padding: 40px; }}
                .header {{ text-align: center; margin-bottom: 30px; }}
                .logo {{ width: 60px; height: 60px; background: linear-gradient(135deg, #10b981, #06b6d4); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; }}
                h1 {{ color: #10b981; margin: 10px 0; }}
                .code {{ background: linear-gradient(135deg, #10b981, #06b6d4); color: #ffffff; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; text-align: center; letter-spacing: 4px; margin: 20px 0; }}
                .footer {{ margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🧠</div>
                    <h1>AI Dropout System</h1>
                    <p>Password Reset Request</p>
                </div>
                <p>Hello,</p>
                <p>We received a request to reset your password. Use the code below to create a new password:</p>
                <div class="code">{reset_code}</div>
                <p>This code will expire in <strong>{expiry_minutes} minutes</strong>.</p>
                <p>If you did not request this password reset, please ignore this email or contact support if you have concerns.</p>
                <div class="footer">
                    <p>© {__import__('datetime').datetime.now().year} AI Dropout Prediction System</p>
                </div>
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
