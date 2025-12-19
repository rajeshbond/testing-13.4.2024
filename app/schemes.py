from pydantic import BaseModel
from datetime import datetime , date
from typing import List, Optional

class SignIn(BaseModel):
    email:str
    password:str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "sample@gmail.com",
                "password": "password"
            }
        }

class Signup(BaseModel):
    name:str
    email:str
    password:str
    mobile:str
    referral_code: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "sample",
                "email": "sample@gmail.com",
                "password": "password",
                "mobile": "1234567890",
                "referral_code": "sample"

            }
        }

class Forgetpwd(BaseModel):
    email:str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "sample@gmail.com",
            }
        }
class Token(BaseModel):
    idToken: str
    refreshToken: str
class UserData(Forgetpwd):
    pass

class DiscountCode(BaseModel):
    code:str
class RazorpayOrder(BaseModel):
    amount:int
    plan:str
    coupon_applied:str
class RazarPayConfrimation(BaseModel):
    payment_id:str
    orderId:str
    signature:str   
    plan:str
    Amount:int
    coupon_applied:str
class Updatecoupon(BaseModel):
    couponused:str

class TradeRegisterInput(BaseModel):
    type:str
    date:date
    symbol:str
    price:float
    qty:int
class test(BaseModel):
    test:str
class RecordId(BaseModel):
    recordId: str
class CompleteTrade(TradeRegisterInput):
    # doc_id:str
    exit_date:date
    exit_price:float
class UpdateRecord(BaseModel):
    exit_qty : int
    uid : str
class Referal(BaseModel):
    uid : str
    nameOnBank: str
    bankName: str
    ifscCode: str
    accountType: str
    accountNumber: str
    terms:bool

class Coupon(BaseModel):
    doc_id: str
    valid: str
    discount_multiplier: float
    applicable: str
    applicablePlan: str
    discount_flat: int
    used: Optional[bool] = None
class CreateCoupon(BaseModel):
    couponName:str
    applicable:Optional[str] = 'all'
    couponApplicable:str
    discountFlat:int
    discountPercentage:float
    validDate:datetime
class EditUser(BaseModel):
    uid : str
    planToChange:str
    # mobile : str


class EditMobile(BaseModel):
    mobile : str
    uid : str

class GetUser(BaseModel):
    uid : str

class CustomerReviewIn(BaseModel):
    review_text: Optional[str]
    rating: Optional[float]

class CustomerReviewOut(BaseModel):
    name : str
    review_text: str
    rating: float
    # current_subscription: str
    created_at: datetime

    class Config:
       from_attributes = True


  





