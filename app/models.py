
from sqlalchemy import TIMESTAMP, Column, Float, Integer, String, text
from .database import Base


class CustomerReview(Base):
  __tablename__ = "customer_reviews"
  id = Column(Integer, primary_key=True, index=True)
  uid = Column(String, index=True, nullable=False)
  name = Column(String, nullable=True)
  current_subscription = Column(String, nullable=True)
  review_text = Column(String, nullable=False)
  rating = Column(Float, nullable=False)
  created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
  
