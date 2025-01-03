from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from google.oauth2 import service_account
from googleapiclient.discovery import build
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

SMTP = 'smtp.hostinger.com'
PORT = 587

FEEDBACK_LINK = 'https://forms.gle/JcPq1uVvjccsjPNj8'

class EmailService:
    def __init__(self, email_address, password):
        self.email_address = email_address
        self.password = password
        # print(self.email_address, self.password)
    def send_format(self, email_to, subject, body):
        # Setup the email content
        # print(f"Email sending {email_to} {subject} {body}")
        body = body
        sender_email = self.email_address
        sender_name = 'Compounding Funda'
        message = MIMEText(body, "plain")
        # message["From"] = self.email_address
        message['From'] = formataddr((sender_name, sender_email))
        message["To"] = email_to
        message["Subject"] = subject
        try:
            server = smtplib.SMTP(SMTP, PORT) # Change to your SMTP server and port
            server.starttls() # Secure the connection
            test = server.login(self.email_address, self.password)
            # print(test)
            text = message.as_string()
            response = server.sendmail(self.email_address, email_to, text)
            print(response)
            # print("Email sent host successfully!")
        except Exception as e:
            # print(f"Error: {e}")
            pass
        finally:
            server.quit()
# --------------------------send confirmation email for subscription plans-------------------------------
    def send_confirmation_email(self, email_to, name, plan):   
        print(f"Email confirmation {email_to} {name} {plan}") 
        if plan == 'free_plan':
            # print("=============================={Free plan}=================================")
            body = f" Dear {name},\n\nThank you for Signingup with Compounding Funda.\n As welcome gift, we offer you a 7 days free access to our most powerful and accurate live market dynamic Screener.\n for more details or any issue \n Please contact us info@compoundingfunda.com.\n\nBest Regards,\nTeam Compounding Funda"
            self.send_format(email_to=email_to, subject=f"Screener Access Confirmation for {plan}", body=body)
            return

        elif plan == 'Market Talk Club':
            body = (
                f"""Dear {name},\n\n
                Thank you for subscribing to {plan} with Compounding Funda.\n\n
                Please click on the link below to provide feedback: {FEEDBACK_LINK}\n\n
                For more details or any issues, please contact us at info@compoundingfunda.com.\n\n
                Best Regards,\n
                Team Compounding Funda"""
            )
            self.send_format(email_to=email_to, subject=f"Screener Access Confirmation for {plan}", body=body)
            return


        elif plan == "Achivers Club":
            body = (
                f"""Dear {name},\n\n
                Thank you for subscribing to {plan} with Compounding Funda.\n\n
                Please click on the link below to provide feedback: {FEEDBACK_LINK}\n\n
                For more details or any issues, please contact us at info@compoundingfunda.com.\n\n
                Best Regards,\n
                Team Compounding Funda"""
            )
            self.send_format(email_to=email_to, subject=f"Screener Access Confirmation for {plan}", body=body)
            return

        elif plan == 'Champions Club':
            body = (
                f"""Dear {name},\n\n
                Thank you for subscribing to {plan} with Compounding Funda.\n\n
                Please click on the link below to provide feedback: {FEEDBACK_LINK}\n\n
                For more details or any issues, please contact us at info@compoundingfunda.com.\n\n
                Best Regards,\n
                Team Compounding Funda"""
            )
            self.send_format(email_to=email_to, subject=f"Screener Access Confirmation for {plan}", body=body)
            return

        else:
            return

        
# -----------------------send Email afer revoke the access--------------------------------------
    def send_revoke_email(self, email_to, sheet_id):



        body = f"Dear User,\n\nAccess removed to view a Google Sheet. \n\n Please call customer support \n\nregards,\nCompounding Funda"
        self.send_format(email_to=email_to, subject="Screeber Access Removed by Compounding Funda", body=body)
# -----------------------------send forget email password link----------------------------- 
    def send_forget_password_email(self, email_to,update_link):
        print("===============================================================")
        # Setup the email content
        body = f"Dear User,\n\nPlease click on the link below to reset your password. \n\n {update_link} \n\n Please call customer support \n\nregards,\nCompounding Funda"
        self.send_format(email_to=email_to, subject="Rest Password", body=body)
      
# ------------------- send VErification mail link ------------------
    def send_verification_email(self, email_to, update_link):
        # print("======================={mail verification}========================================")
        # Setup the email content
        body = f"Dear,\n\nPlease click on the link below to verify your email. \n\n {update_link} \n\n Please call customer support \n\nregards,\nCompounding Funda" 
        
        self.send_format(email_to=email_to, subject="Verify Email", body=body)
        