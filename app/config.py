from pydantic_settings import BaseSettings

class Settings(BaseSettings):
  sheet_id : str
  google_sheet_api : str
  firebase_config : dict
  service_account_key : dict
  email : str
  password : str
  your_id : str
  your_secret : str
  google_cloud_api_main: dict
  database_hostname: str
  database_port: str
  database_password: str
  database_name: str
  database_username: str
  secret_key: str
  algorithm: str
  access_token_expire_minutes : int 

  class Config:
    env_file = ".env"
    env_file_encoding = "utf-8"

settings = Settings() 
