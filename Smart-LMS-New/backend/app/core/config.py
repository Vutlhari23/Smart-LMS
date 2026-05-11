from datetime import timedelta

SECRET_KEY = "change-this-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

class Settings:
    authjwt_secret_key: str = SECRET_KEY
    access_token_expire_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES

settings = Settings()
