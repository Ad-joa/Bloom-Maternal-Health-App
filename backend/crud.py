from sqlalchemy.orm import Session
import models, schemas
import bcrypt

def get_password_hash(password: str):
    salt = bcrypt.gensalt()
    # bcrypt requires bytes, so encode and decode
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        name=user.name, 
        email=user.email, 
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_symptom_log(db: Session, log: schemas.SymptomLogCreate, user_id: int):
    db_log = models.SymptomLog(
        user_id=user_id,
        symptoms=log.symptoms
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
