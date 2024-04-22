
from fastapi import FastAPI, HTTPException, status
from fastapi.responses import HTMLResponse, JSONResponse
import random , uuid
from starlette.middleware.sessions import SessionMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from fastapi.middleware.cors import CORSMiddleware
from . import schemes
from fastapi.responses import RedirectResponse
import logging
from datetime import datetime, timedelta ,timezone
# -------------------env ---------------------
from dotenv import load_dotenv
import os
import json
from pathlib import Path
from .config import Settings
# --------------------- Firebase ---------------------
import firebase_admin
from firebase_admin import credentials,auth
from firebase_admin import firestore
from google.cloud.firestore_v1 import SERVER_TIMESTAMP, DocumentReference
# ----------------------pyrebase
import pyrebase
# ----------------------Mail server -----------------------
from .email_service import EmailService
# from .database import fire_database
from datetime import datetime
# ----------------------Google Credentials -----------------------
from google.oauth2.service_account import Credentials # pip install google-auth
from googleapiclient.discovery import build # pip install google-auth
# ----------------------Rqazor Pay -----------------------
# from .const import credentials_data,sheet_id,firebaseConfig,serviceAccountKey,EMAIL,PASSWORD, YOUR_ID, YOUR_SECRET
# --------------------Rqazor Pay------------------------------------------------------------------------
import razorpay
# ----------------------------------

# -----------------Email Service-----------------
# env_path = Path('.', '.env')
# -----------------------------------------------
# load_dotenv(dotenv_path='.env')
settings = Settings()

# print(f"============={settings.google_cloud_api_main}")
# -----------------FastAPI-----------------
app = FastAPI()

send_mail = EmailService(settings.email,settings.password)
##### lIST OF origins

origins = ['*']

# #  pasting CORAS CODE #################
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------- Firebase ---------------------
# if not firebase_admin._apps:
cred = credentials.Certificate(settings.service_account_key)
firebase_admin.initialize_app(cred)
db = firestore.client()
# ------------------------------------------------------


# ----------------------------{pyrebase}---------------------------
pyre = pyrebase.initialize_app(settings.firebase_config)
# -----------------------------------------------------------------

app.add_middleware(SessionMiddleware, secret_key = "snt_solotions")

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


# ---------------------Define Functions  -------------------------------------------

def refresh_id_token(current_id_token):
    try:
        # Verify the current ID token
        decoded_token = auth.verify_id_token(current_id_token)
        # Get the UID from the decoded token
        uid = decoded_token.get('uid')
        # Generate a new ID token with an updated expiration time
        refreshed_id_token = auth.create_custom_token(uid)
        return refreshed_id_token
    except ValueError as e:
        raise HTTPException(status_code=401, detail="Invalid ID token")
    except auth.AuthError as e:
        raise HTTPException(status_code=401, detail="ID token verification failed")


# ---------------------Get Method -------------------------------------------
# ---------------------Sending virtual enviroment to Java Scripts ---------------
@app.get("/env")
async def get_env():
    # print(f"---------------------{settings.your_id}")
    return JSONResponse(content=settings.your_id)

@app.get("/")
async def root(request: Request):
    user = request.session.get("user")
    # print(credentials_data)
    try:
        if user:
           
            return RedirectResponse(url="/dashboard")
        return templates.TemplateResponse(  
                name="signin.html",
                context={"request": request}
        )
    except Exception as e:
        return templates.TemplateResponse(
                name="signin.html",
                context={"request": request}
        )
    
@app.get('/signup', response_class=HTMLResponse)
async def get_signup(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

@app.get('/forgetpwd', response_class=HTMLResponse)
async def get_forgetpwd(request: Request):
    return templates.TemplateResponse("forgetpwd.html", {"request": request})
@app.get('/traderegister', response_class=HTMLResponse)
async def get_forgetpwd(request: Request):
    try:
        user = request.session.get("user")
        update_user_subsription(request)
        db_data_user= db.collection('users').document(user['localId']).get().to_dict()

        # print(db_data_user)
    
        if (db_data_user['screener_active']):
            return templates.TemplateResponse("trading.html", {"request": request})
        else:
            return RedirectResponse(url="/dashboard")
    except Exception as e:
        return RedirectResponse(url="/")
    

@app.get('/screener', response_class=HTMLResponse)
async def get_gsheet(request: Request):
    try:
        user = request.session.get("user")
        update_user_subsription(request)
        db_data_user= db.collection('users').document(user['localId']).get().to_dict()

        # print(db_data_user)
    
        if (db_data_user['screener_active']):
            return templates.TemplateResponse("gsheet.html", {"request": request})
        else:
            return RedirectResponse(url="/dashboard")
    except Exception as e:
        return RedirectResponse(url="/")
    

@app.get('/logout', response_class=HTMLResponse)
async def get_logout(request: Request):
    request.session.clear()
    return templates.TemplateResponse("signin.html", {"request": request})

@app.get('/dashboard', response_class=HTMLResponse)
async def get_dashboard(request: Request):
    try:
        # print(f"---------credentials----{credentials_data}")
        user = request.session.get("user")
        if not user:
            return RedirectResponse(url="/")
        db_data_user= db.collection('users').document(user['localId']).get().to_dict()
        if db_data_user:
            # print(f"-----------------{db_data_user}")
            # update_user_subsription(request)
            return templates.TemplateResponse("dashboard.html", {"request": request })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(f"error {e}"))

@app.get('/getUsername',response_class=HTMLResponse)
async def get_user_data(request: Request):
    try:
        user = request.session.get("user")

        if not user:
            return JSONResponse(content={"error": "User not authenticated"}, status_code=401)

        db_data_user= db.collection('users').document(user['localId']).get().to_dict()
    

        if not db_data_user:
            return JSONResponse(content={"error": "User not found"}, status_code=404)

        return JSONResponse(content={"user": db_data_user}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error while getting user data: {e}")
    
# ------------------------Post Method -------------------------------------------
# ------------------------Login-------------------------------------------
@app.post('/signin', status_code= status.HTTP_200_OK)
async def login(request1: schemes.SignIn, request: Request):
    # print(request1.email)
    # print(request1.password)
    try:
        user = pyre.auth().sign_in_with_email_and_password(email=request1.email, password=request1.password)
        userser_info = pyre.auth().get_account_info(user['idToken'])
        print(f"---------------user info {userser_info['users'][0]['email']}")
        isUserVerifired = userser_info['users'][0]['emailVerified']
        email = userser_info['users'][0]['email']
        print(f"Data extracted {isUserVerifired}")
        if isUserVerifired == False:
            email_verification_link = auth.generate_email_verification_link(email)
            print(f'----------------{email_verification_link}')
            send_mail.send_verification_email(email_to=email, update_link=email_verification_link) 
            return JSONResponse(content={"email_status": "unverifed"}, status_code=status.HTTP_208_ALREADY_REPORTED)
        else:
            request.session["user"] = dict(user) # user session
            # db_user = db.collection('users').document(user['localId'])
            # db_data_user= db_user.get().to_dict()
            # print(f"------user-----{db_data_user}")
            
            return JSONResponse(content={"data": "Login Successful"}, status_code=status.HTTP_200_OK)

    except Exception as e:
        print(f"Exception {e}")
        raise HTTPException(
        status_code=400,
        detail= f" Invaid credentials --{e}")

       
    
# ------------------------Post Method -------------------------------------------
# ------------------------Signup-------------------------------------------

@app.post('/signup',status_code= status.HTTP_200_OK)
def signup(request: schemes.Signup):

    name = request.name
    email = request.email
    pasword = request.password
    mobile = request.mobile

    try:
        user = auth.create_user(
            email=email,
            password=pasword
        )

        data = {
            'uid':user.uid,
            'name':name,
            'email':email,
            'mobile':mobile,
            'isUserAdmin': False,
            'screener_active': True,
            'isBlocked': False,
            'subscriptionDetails':{
                'currentSubscription': 'Free - trial - 90 days',
                'subscriptionStatus': 'Active',
                'coupon_applied':'TRIAL90',
                'free_trial_over': False,
                'subscriptionDate': datetime.now().isoformat(),
                'subscriptionEndDate': (datetime.now() + timedelta(90)).isoformat(),
                'paidSubscription': False,
            },
            'isEmailVerified': False,
            'created_at': datetime.now().isoformat(),
        } 

        email_verification_link = auth.generate_email_verification_link(email=email)
        # print(email_verification_link)
        send_mail.send_verification_email(email_to=email, update_link=email_verification_link)     
        db.collection('users').document(user.uid).set(data)
        # print(f"--database---------{testb}")
        
        send_mail.send_confirmation_email(email_to=email, name = name, plan='free_plan')
        assign_permission(senderEmail=email,name=name, plan='free_plan')
        
      
        send_mail.send_verification_email(email_to=email, update_link=email_verification_link)   
    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail=f"Email already exists for {email}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating user: {e}")

    return{
        "message": "Signup Success"
    }

# ------------------------Post Method -------------------------------------------
# ------------------------Forget Password-------------------------------------------

@app.post('/forgetpwd',status_code= status.HTTP_200_OK)
async def forget_password(request: schemes.Forgetpwd):

        # Send password reset email
    try:
        forget_password_link= auth.generate_password_reset_link(request.email)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error sending password reset email: {e}")
    try:
        send_mail.send_forget_password_email( email_to=request.email, update_link=forget_password_link)
    except Exception as e:
        return templates.TemplateResponse(
            name='error.html',
            context= {'request':request, 'error':e.error}
        )

        # raise HTTPException(status_code=500, detail=f"Error sending password reset email: {e}")    
    
@app.patch('/subscribe')
async def subscribe(request:Request):
    try:
        user = request.session.get("user")
        if not user:
            
            return JSONResponse(content={"error": "User not authenticated"}, status_code=401)
        
        db_user = db.collection('users').document(user['localId'])
        db_data_user= db_user.get().to_dict()
        

        if db_data_user['isSubscribed']:
        
            if 'created_at' in db_data_user:
                if isinstance(db_data_user['created_at'], datetime):
                    db_data_user['created_at'] = db_data_user['created_at'].isoformat()
            if 'paymentDate' in db_data_user:
                if isinstance(db_data_user['paymentDate'], datetime):
                    db_data_user['paymentDate'] = db_data_user['paymentDate'].isoformat()
            if 'expiryDate' in db_data_user:
                if isinstance(db_data_user['expiryDate'], datetime):
                    db_data_user['expiryDate'] = db_data_user['expiryDate'].isoformat()
            if 'subscriptionDate' in db_data_user:
                if isinstance(db_data_user['subscriptionDate'], datetime):
                    db_data_user['subscriptionDate'] = db_data_user['subscriptionDate'].isoformat()
            return JSONResponse(content={"data": db_data_user}, status_code=status.HTTP_208_ALREADY_REPORTED)
        else:
            next_date = datetime.now() + timedelta(days=365)
            data = {
                'SubscrbptionAmount': '6000',
                'paymentMode': 'upi',
                'paymentStatus':True,
                'paymentDate': datetime.now(),
                'isSubscribed':True,
                'expiryDate': next_date,
                'subscriptionDate': datetime.now(),
                'created_at': datetime.now(),
            } 
            
     
            updated_user = db_user.update(data)
            db_data_user= db.collection('users').document(user['localId']).get().to_dict()
            if 'created_at' in db_data_user:
                if isinstance(db_data_user['created_at'], datetime):
                    db_data_user['created_at'] = db_data_user['created_at'].isoformat()
            if 'paymentDate' in db_data_user:
                if isinstance(db_data_user['paymentDate'], datetime):
                    db_data_user['paymentDate'] = db_data_user['paymentDate'].isoformat()
            if 'expiryDate' in db_data_user:
                if isinstance(db_data_user['expiryDate'], datetime):
                    db_data_user['expiryDate'] = db_data_user['expiryDate'].isoformat()
            if 'subscriptionDate' in db_data_user:
                if isinstance(db_data_user['subscriptionDate'], datetime):
                    db_data_user['subscriptionDate'] = db_data_user['subscriptionDate'].isoformat() 
            # assign_permission(senderEmail = db_data_user['email'],name= db_data_user['name'])
    
            return JSONResponse(content={"data":db_data_user,"message":"Subscribed Successfully"}, status_code=status.HTTP_200_OK)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error while getting user data: {e}")
        
# -------------------------------Sheet controlling -------------------------------------------------------
    

# ------------------------post Method -------------------------------------------
@app.post('/revoke')
async def revoke_permission(user_data:schemes.UserData,request: Request):
    user = request.session.get("user")
    db_user = db.collection('users').document(user['localId']).get().to_dict()
    email = user_data.email
    print(f"==============={email}======={db_user['isUserAdmin']}")
    try:
        if db_user['isUserAdmin']: 
            print("inside if ")
            revokeGoogleSheetPermission(email)
            return JSONResponse(content={"status":f" Permission succefully removed  {email}"}, status_code=200)
        else:
            print("inside else")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Looks like your dont have admin Rights" )
    except Exception as e:
        print(f"in side exception {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=f"{e}")
    
# ------------------------Disconnect api ---------------------------------
@ app.post('/discount',status_code= status.HTTP_200_OK)
async def fetchdiscount(request2: schemes.DiscountCode, request: Request):

   discount = db.collection('coupon').document(request2.code).get().to_dict()

   return JSONResponse(content={"data":discount}, status_code=status.HTTP_200_OK)

@app.post('/rporder',status_code= status.HTTP_200_OK)
def razorpay_order(rporder: schemes.RazorpayOrder, request: Request):
    rzamount = rporder.amount *100 # convereted to paisa as per razorpay 
    order = str(uuid.uuid4())
    
    try:
        user = request.session.get("user")
    
        client = razorpay.Client(auth=(settings.your_id, settings.your_secret))
        data = { "amount": rzamount, "currency": "INR", "receipt": order, "notes": { "plan": rporder.plan, "coupon_applied": rporder.coupon_applied } }
        order_details = client.order.create(data=data)
        try:
            # user = request.session.get("user")
            if not user:
                raise HTTPException(status_code=400, detail="User not found in session")
            db_user = db.collection('users').document(user['localId'])
            recieptdb = db.collection('reciept').document()
            
            data ={
                'razorpayorder':{
                    'order_id':order_details['id'],
                    'amount':rporder.amount,
                    'plan':rporder.plan,
                    'notes':order_details['notes'],
                    'created_at': datetime.now().isoformat()
                }
            }
            update = db_user.update(data)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error while getting user data: {e}")
        return JSONResponse(content={"data":order_details}, status_code=status.HTTP_200_OK)
        pass
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error while getting user data: {e}")
# --------------------Razor pay order confrimation 
@app.post('/paymentconfirmation',status_code= status.HTTP_200_OK)
async def confimation(rpconfrimation: schemes.RazarPayConfrimation, request: Request): 
    
    try:
        user = request.session.get('user')
        if not user:
            raise HTTPException(status_code=400, detail="User not found in session")
        db_user = db.collection('users').document(user['localId'])
        db_data_user= db_user.get().to_dict()
        if rpconfrimation.plan == "Achivers Club" or rpconfrimation.plan == "Champions Club":
            subEnd = (datetime.now() + timedelta(364*25)).isoformat()
        else:
            subEnd = (datetime.now() + timedelta(364)).isoformat()
            # comment: 
        pay_id = rpconfrimation.payment_id
        client = razorpay.Client(auth=(settings.your_id,settings.your_secret))
        paymentdetails = client.payment.fetch(pay_id)
        if(rpconfrimation.orderId == paymentdetails['order_id']):
            data ={
                "screener_active":True,
                'subscriptionDetails':{
                    'currentSubscription': rpconfrimation.plan,
                    'subscriptionStatus': 'Active',
                    'free_trial_over': True,
                    'subscriptionDate': datetime.now().isoformat(),
                    'subscriptionEndDate': subEnd,
                    'coupon_applied': rpconfrimation.coupon_applied,
                    'paidSubscription': True,
                },
                'razorpayconfimation':{
                    'payment_id':rpconfrimation.payment_id,
                    'orderId':rpconfrimation.orderId,
                    'signature':rpconfrimation.signature,
                    'plan':rpconfrimation.plan,
                    'Amount':rpconfrimation.Amount,
                    'payments_status':paymentdetails,
                    'payment-time':datetime.now().isoformat()
                }
                
            }
            update = db_user.update(data)
            assign_permission(senderEmail=db_data_user['email'],name=db_data_user['name'], plan=rpconfrimation.plan)
            data_screen = {
                'screener_active': True,
            }
            update = db_user.update(data_screen)
            return JSONResponse(content={"data": "Payment Sucessful Successful"}, status_code=status.HTTP_200_OK)   
        else:
            return JSONResponse(content={"data": "Payment Failed"}, status_code=status.HTTP_504_GATEWAY_TIMEOUT)
        
    
        pass
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error while getting user data: {e}")
    
  
  # ------------------------ Method -------------------------------------------

# ----------------------------------Coupon checking
@app.post('/checkcoupon',status_code= status.HTTP_200_OK)
async def checkcoupon(disc: schemes.DiscountCode,request: Request):
    try:
        user = request.session.get("user")
        # print(user['localId'])
        # print(disc.code)
        discount = db.collection('coupon').document(disc.code).get().to_dict()
        # print(f"----------------------{discount}")
        if discount == None:
            return JSONResponse(content={"data":{'status':False,'coupon':'coupon not found','coupon_state':'Please Enter Valid Coupon'}}, status_code=status.HTTP_200_OK)
        else:
            if 'applicable' in discount:
                # print('applicable check condition')
                if discount['applicable'] == 'all':
                    # print("all")
                    couponused = db.collection('coupon').document(disc.code).collection('used').get()
                    for con in couponused:
                        # print(con.to_dict())
                        if user['localId'] == con.to_dict()['user_uid']:
                            # print('coupon already used')
                            return JSONResponse(content={"data":{'status':False,'coupon':'coupon already used ','coupon_state':'not applicable'}}, status_code=status.HTTP_200_OK)
                    else:
                        if 'valid' in discount:
                            if isinstance(discount['valid'], datetime):
                                discount['valid'] = discount['valid'].isoformat(
                                )   
                        # print(f"formated ------{discount}")
                        if discount['valid'] < datetime.now().isoformat():
                            # print('coupon expired')
                            return JSONResponse(content={"data":{'status':False,'coupon':'coupon expired','coupon_state':'not applicable'}}, status_code=status.HTTP_200_OK)    
                        return JSONResponse(content={"data":{'status':True,'coupon':disc.code,'discount_multiplier':discount['discount_multiplier'],'discount_flat':discount['discount_flat']}}, status_code=status.HTTP_200_OK)                
                else:
                    if 'valid' in discount:
                        if isinstance(discount['valid'], datetime):
                            discount['valid'] = discount['valid'].isoformat(
                        )   
                        # print(f"formated ------{discount}")
                    if user['localId'] != discount['applicable']:

                        return JSONResponse(content={"data":{'status':False,'coupon':'Coupon not vaild for the user','coupon_state':'not applicable'}}, status_code=status.HTTP_200_OK)
                    elif discount['coupon_used'] == True:
                        print('coupon used')
                        return JSONResponse(content={"data":{'status':False,'coupon':'coupon already used ','coupon_state':'not applicable'}}, status_code=status.HTTP_200_OK)
                    elif discount['valid'] < datetime.now().isoformat():
                        # print('coupon expired')
                        return JSONResponse(content={"data":{'status':False,'coupon':'coupon expired','coupon_state':'not applicable'}}, status_code=status.HTTP_200_OK)
                    else:
                        # print('coupon valid')
                        return JSONResponse(content={"data":{'status':True,'coupon':disc.code,'discount_multiplier':discount['discount_multiplier'],'discount_flat':discount['discount_flat']}}, status_code=status.HTTP_200_OK)
            else:
                return JSONResponse(content={"data":{'status':False,'coupon':'coupon not applicable','coupon_state':'not applicable'}}, status_code=status.HTTP_200_OK)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error while getting user data: {e}")

@app.post('/updatecoupon',status_code= status.HTTP_200_OK)         
async def updatecoupon(disx: schemes.Updatecoupon,request: Request):
    try:
        user = request.session.get("user")
        # print(user['localId'])
        print(disx.couponused)
        discount = db.collection('coupon').document(disx.couponused).get().to_dict()
        # print(f"----------------------{discount}")
        if discount == None:
            return JSONResponse(content={"data":{'status':"coupon code not found"}}, status_code=status.HTTP_200_OK)
        else:
            if discount['applicable'] == 'all':
                data = {"user_uid":user['localId'],"used":True}
                db.collection('coupon').document(disx.couponused).collection('used').document(user['localId']).set(data)
                return JSONResponse(content={"data":{'status':True}}, status_code=status.HTTP_200_OK)
            else:
                if user['localId'] != discount['applicable']:
                    return JSONResponse(content={"data":{'status':"coupon code not found"}}, status_code=status.HTTP_200_OK)
                else:
                    data = {"coupon_used":True}
                    db.collection('coupon').document(disx.couponused).update(data)
                    return JSONResponse(content={"data":{'status':True}}, status_code=status.HTTP_200_OK)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error while getting user data: {e}")
          
@app.post('/updateregentry',status_code=status.HTTP_200_OK)
async def update_entry(entry:schemes.TradeRegisterInput, request: Request):
    print(f"-----------------------in side------------------------")
    record={
        "EntryType":entry.type,
        "EntryDate":entry.date.isoformat(),
        "EntrySymbol": entry.symbol.upper(),
        "EntryPrice": entry.price,
        "EntryQty": entry.qty,
        "created_at":datetime.now().isoformat()
    }
    try:
        user = request.session.get('user')
        if user:
            parent_doc_ref = db.collection('users').document(user['localId'])
            subcollection_ref = parent_doc_ref.collection('entry')
            subcollection_ref.add(record)
            return HTTPException(status_code=status.HTTP_200_OK, detail=f"Record Added Sucessfully")
        else:
            return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Used is not Logged In")
    except Exception as e:
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error while getting user data: {e}")
@app.post('/test',status_code=status.HTTP_200_OK)
async def test():
    print("Ping sucess")
    return {"sucess":"done"}
@app.get("/fetchunregister", status_code=status.HTTP_200_OK)
async def fetchUnRegister(request: Request):
    try:
        user = request.session.get("user")
        if user:
            parent_doc_ref = db.collection('users').document(user['localId'])
            subcollection_ref = parent_doc_ref.collection('entry')
            # query_snapshot = subcollection_ref.get()
            query_snapshot = subcollection_ref.order_by('created_at', direction=firestore.Query.DESCENDING).get()

            entries = []
            entries = [{**doc.to_dict(), "doc_id": doc.id} for doc in query_snapshot]
            # print(entries)
            return JSONResponse(content={"records":entries}, status_code=status.HTTP_200_OK)
        else:
            return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Used is not Logged In")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error while getting user data: {e}")
@app.delete("/delete_record/{doc_id}")
async def delete_entry(doc_id:str,request: Request):
    try:
        user = request.session.get("user")
        if user:
            doc_ref = db.collection('users').document(user['localId']).collection('entry').document(doc_id) 
            # Delete the document
            doc_ref.delete()
            return HTTPException(status_code=status.HTTP_200_OK, detail=f"Record Sucessfully Deleted")
        else:
            return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Used is not Logged In")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.post('/ctentry', status_code=status.HTTP_200_OK)
def completeTradeEntry(centry:schemes.CompleteTrade,request: Request):
    print(centry)
    record={
    "entry_type": centry.type,
    "entry_date": centry.date.isoformat(),
    "entry_symbol":centry.symbol,
    "entry_price": centry.price,
    "entry_qty": centry.qty,
    "exit_date": centry.exit_date.isoformat(),
    "exit_price": centry.exit_price,
    "created_at":datetime.now().isoformat()
}
    print(record)

    try:
        user = request.session.get('user')
        if user:
            parent_doc_ref = db.collection('users').document(user['localId'])
            subcollection_ref = parent_doc_ref.collection('filled')
            subcollection_ref.add(record)
            return HTTPException(status_code=status.HTTP_200_OK, detail=f"Record Added Sucessfully")
        else:
            return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Used is not Logged In")
    except Exception as e:
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error while getting user data: {e}")
@app.get("/fetchfilled", status_code=status.HTTP_200_OK)
async def fetchUnRegister(request: Request):
    try:
        user = request.session.get("user")
        if user:
            parent_doc_ref = db.collection('users').document(user['localId'])
            subcollection_ref = parent_doc_ref.collection('filled')
            # query_snapshot = subcollection_ref.get()
            query_snapshot = subcollection_ref.order_by('created_at', direction=firestore.Query.DESCENDING).get()

            entries = []
            entries = [{**doc.to_dict()} for doc in query_snapshot]
            print(entries)
            return JSONResponse(content={"records":entries}, status_code=status.HTTP_200_OK)
        else:
            return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Used is not Logged In")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error while getting user data: {e}")


# ------------------------ Methods -------------------------------------------
def assign_permission(senderEmail,name , plan):

    email = senderEmail
    subscribe_plan = plan
    print(f"-----assign permission----{plan}---------{plan}")
    try:
        credentials = Credentials.from_service_account_info(settings.google_cloud_api_main)
        drive_service = build('drive', 'v3', credentials=credentials)
        # Sheet ID
        print(f"-----sheet----{settings.sheet_id}---------{drive_service}")
        sheet_id_1 = settings.sheet_id
        # Email address to grant access
        email_address = email

        # Share the Google Sheet with the specified email address
        drive_service.permissions().create(
            fileId=sheet_id_1, 
            body={'type': 'user', 
                  'role': 'reader', 
                  'emailAddress': email_address,
                  'sendNotificationEmail': False},
            fields='id'
        ).execute()

        print(f"Shared Google Sheet '{sheet_id_1}' with {email_address} for view access.")
    

        send_mail.send_confirmation_email(email_to=email_address, name=name , plan=subscribe_plan)
        print(f"View Permission granted {email_address}")
        return JSONResponse(content={"status":f"View Permission granted {email_address}"}, status_code=201)

    
    except Exception as e:
        # print(f"Error --------> {e}")
        raise HTMLResponse(status_code= 400 , detail = "Invalid Credentials")
    
# Get a reference to the counter node in your Firebase Realtime Database
def update_user_subsription(current_user):
    user = current_user.session.get("user")
    db_data_user= db.collection('users').document(user['localId']).get().to_dict()
    # print(f"-------current user ----------{db_data_user}")
    screener_active_status =db_data_user['screener_active'] 
    free_trail_over_status =db_data_user['subscriptionDetails']['free_trial_over']
    paidSubscription_status =db_data_user['subscriptionDetails']['paidSubscription']
    currentSubscription_status =db_data_user['subscriptionDetails']['currentSubscription']
    sub_start_date = db_data_user['subscriptionDetails']['subscriptionEndDate']
    subscriptionStatus =db_data_user['subscriptionDetails']['subscriptionDate']
    sub_expiry_date = db_data_user['subscriptionDetails']['subscriptionEndDate']
    if (free_trail_over_status == False and currentSubscription_status == "Free - trial - 90 days"):
        print("inside ")
        if sub_expiry_date < datetime.now().isoformat():
            print(f"----------contiotion True---------{sub_expiry_date} -----{datetime.now().isoformat()}")
            updated_status = {
                'subscriptionDetails':{
                    'currentSubscription': f"{currentSubscription_status} - Ended",
                    'subscriptionStatus': 'In-Active',
                    'free_trial_over': True,
                    'subscriptionDate': datetime.now().isoformat(),
                    'subscriptionEndDate': sub_expiry_date,
                    'coupon_applied': "Free90",
                    'paidSubscription': False,
                    "coupon_applied":"no coupon applied"
                },
                "screener_active":False,
            }
            db.collection('users').document(user['localId']).update(updated_status)
            revokeGoogleSheetPermission(db_data_user['email'])
            return
            # print(f" data -------------{updated_status}")
    elif (paidSubscription_status == True and free_trail_over_status == True ):
        if sub_expiry_date < datetime.now().isoformat():
            print('in side paid')
            updated_status = {
                    'subscriptionDetails':{
                        'currentSubscription': f"{currentSubscription_status} - Ended",
                        'subscriptionStatus': 'In-Active',
                        'free_trial_over': True,
                        'subscriptionDate': datetime.now().isoformat(),
                        'subscriptionEndDate': sub_expiry_date,
                        'coupon_applied': "Free90",
                        'paidSubscription': False,
                        "coupon_applied":"no coupon applied"
                    },
                    "screener_active":False,
                }
            db.collection('users').document(user['localId']).update(updated_status)
            revokeGoogleSheetPermission(db_data_user['email'])
            return
            # print(f" paid -------------{updated_status}")

    else:
        return 



def revokeGoogleSheetPermission(current_user):
    
    email_address = current_user
    print(f"---email-----{email_address}")
    try:
        credentials = Credentials.from_service_account_info(settings.google_cloud_api_main)
        # print(f"---------------------------{credentials}-------------")
        drive_service = build('drive', 'v3', credentials=credentials)
        # Sheet ID
        sheet_id_1 = settings.sheet_id
        # Email address to grant access
      
        # Retrieve permission ID for the specified email address
        response = drive_service.permissions().list(fileId=sheet_id_1, fields='permissions(id,emailAddress,role)').execute()
        permissions = response.get('permissions', [])
        # print(permissions)

        permission_id = None
        for permission in permissions:
            # print(permission)
            if permission['emailAddress'] == email_address:
                permission_id = permission['id']

                break

        # If permission found, revoke it
        if permission_id:
            drive_service.permissions().delete(fileId=sheet_id_1, permissionId=permission_id).execute()
            # print(f"Revoked access for {email_address} from Google Sheet '{sheet_id}'.")
            send_mail.send_revoke_email(email_to=email_address, sheet_id=sheet_id_1 )
            return JSONResponse(content={"status":f" Permission succefully removed  {email_address}"}, status_code=200)
        else:
            # print(f"No access found for {email_address} in Google Sheet '{sheet_id}'.")
            return JSONResponse(content={"status":f"No permission found for {email_address}"}, status_code=200)
    except Exception as e:
        print(f"Error --------> {e}")
        raise HTMLResponse(status_code= 400 , detail = "Invalid Credentials")
    pass



