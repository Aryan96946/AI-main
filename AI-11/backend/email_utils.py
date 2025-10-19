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
