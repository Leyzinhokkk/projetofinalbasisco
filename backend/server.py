from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security setup
SECRET_KEY = "wayne_industries_secret_key_gotham_security_2025"
ALGORITHM = "HS256"
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create the main app without a prefix
app = FastAPI(title="Wayne Industries Security System", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    full_name: str
    role: str  # employee, manager, security_admin
    department: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    access_level: int = 1  # 1=employee, 2=manager, 3=security_admin

class UserCreate(BaseModel):
    username: str
    email: str
    full_name: str
    password: str
    role: str
    department: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Resource Models
class Resource(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # equipment, vehicle, security_device
    category: str
    location: str
    status: str  # active, maintenance, inactive, assigned
    assigned_to: Optional[str] = None
    description: str
    acquisition_date: datetime
    last_maintenance: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: str

class ResourceCreate(BaseModel):
    name: str
    type: str
    category: str
    location: str
    status: str = "active"
    assigned_to: Optional[str] = None
    description: str
    acquisition_date: datetime

# Access Log Models  
class AccessLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    action: str
    resource_id: Optional[str] = None
    location: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str  # success, denied, warning

class AccessLogCreate(BaseModel):
    user_id: str
    user_name: str
    action: str
    resource_id: Optional[str] = None
    location: str
    status: str = "success"

# Security Alert Models
class SecurityAlert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    message: str
    severity: str  # low, medium, high, critical
    location: str
    status: str = "active"  # active, resolved, investigating
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

class SecurityAlertCreate(BaseModel):
    title: str
    message: str
    severity: str
    location: str

# Security functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"username": username})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return User(**user)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Initialize default users and data
async def init_default_data():
    # Check if users exist
    existing_users = await db.users.count_documents({})
    if existing_users == 0:
        # Create default users
        default_users = [
            {
                "username": "bruce.wayne",
                "email": "bruce@wayneindustries.com",
                "full_name": "Bruce Wayne",
                "password": hash_password("batman123"),
                "role": "security_admin",
                "department": "Executive",
                "access_level": 3
            },
            {
                "username": "lucius.fox",
                "email": "lucius@wayneindustries.com", 
                "full_name": "Lucius Fox",
                "password": hash_password("foxtech123"),
                "role": "manager",
                "department": "R&D",
                "access_level": 2
            },
            {
                "username": "alfred.pennyworth",
                "email": "alfred@wayneindustries.com",
                "full_name": "Alfred Pennyworth",
                "password": hash_password("alfred123"),
                "role": "employee",
                "department": "Security",
                "access_level": 1
            }
        ]
        
        for user_data in default_users:
            user = User(**user_data)
            await db.users.insert_one(user.dict())
        
        # Create default resources
        default_resources = [
            {
                "name": "Tumbler",
                "type": "vehicle",
                "category": "Armored Vehicle",
                "location": "Cave Garage Level B3",
                "status": "active",
                "assigned_to": "bruce.wayne",
                "description": "Advanced armored vehicle with stealth capabilities",
                "acquisition_date": datetime(2020, 1, 1),
                "created_by": "bruce.wayne"
            },
            {
                "name": "Batsuit Mark VII",
                "type": "equipment",
                "category": "Protective Gear",
                "location": "Equipment Vault A",
                "status": "active",
                "assigned_to": "bruce.wayne",
                "description": "Advanced tactical protection suit with integrated systems",
                "acquisition_date": datetime(2022, 6, 15),
                "created_by": "lucius.fox"
            },
            {
                "name": "Perimeter Sensors Array",
                "type": "security_device",
                "category": "Surveillance",
                "location": "Building Perimeter",
                "status": "active",
                "description": "Advanced motion detection and surveillance system",
                "acquisition_date": datetime(2023, 3, 10),
                "created_by": "lucius.fox"
            }
        ]
        
        for resource_data in default_resources:
            resource = Resource(**resource_data)
            await db.resources.insert_one(resource.dict())
        
        # Create sample access logs
        sample_logs = [
            {
                "user_id": "bruce.wayne",
                "user_name": "Bruce Wayne", 
                "action": "Accessed Cave Garage",
                "location": "Cave Garage Level B3",
                "status": "success",
                "timestamp": datetime.utcnow() - timedelta(hours=2)
            },
            {
                "user_id": "lucius.fox",
                "user_name": "Lucius Fox",
                "action": "Equipment Inspection",
                "location": "R&D Lab",
                "status": "success", 
                "timestamp": datetime.utcnow() - timedelta(hours=4)
            }
        ]
        
        for log_data in sample_logs:
            log = AccessLog(**log_data)
            await db.access_logs.insert_one(log.dict())
        
        # Create sample security alerts
        sample_alerts = [
            {
                "title": "Unauthorized Access Attempt",
                "message": "Failed login attempts detected from external IP",
                "severity": "medium",
                "location": "Main Entrance",
                "status": "investigating"
            },
            {
                "title": "Equipment Maintenance Due",
                "message": "Perimeter sensors require scheduled maintenance",
                "severity": "low", 
                "location": "Building Perimeter",
                "status": "active"
            }
        ]
        
        for alert_data in sample_alerts:
            alert = SecurityAlert(**alert_data)
            await db.security_alerts.insert_one(alert.dict())

# Authentication routes
@api_router.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin):
    user = await db.users.find_one({"username": login_data.username})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.get("is_active", True):
        raise HTTPException(status_code=401, detail="User account is inactive")
    
    access_token = create_access_token(data={"sub": user["username"]})
    
    # Create access log
    access_log = AccessLog(
        user_id=user["username"],
        user_name=user["full_name"],
        action="System Login",
        location="Wayne Industries Portal",
        status="success"
    )
    await db.access_logs.insert_one(access_log.dict())
    
    user_response = {k: v for k, v in user.items() if k != "password"}
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@api_router.post("/auth/register", response_model=User)
async def register(user_data: UserCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != "security_admin":
        raise HTTPException(status_code=403, detail="Only security administrators can create users")
    
    # Check if user exists
    existing_user = await db.users.find_one({"$or": [{"username": user_data.username}, {"email": user_data.email}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Set access level based on role
    access_levels = {"employee": 1, "manager": 2, "security_admin": 3}
    
    user_dict = user_data.dict()
    user_dict["password"] = hash_password(user_data.password)
    user_dict["access_level"] = access_levels.get(user_data.role, 1)
    
    user = User(**user_dict)
    await db.users.insert_one(user.dict())
    
    return user

# User routes
@api_router.get("/users/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.get("/users", response_model=List[User])
async def get_users(current_user: User = Depends(get_current_user)):
    if current_user.access_level < 2:  # Manager level or above
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    users = await db.users.find({}, {"password": 0}).to_list(100)
    return [User(**user) for user in users]

# Resource routes
@api_router.get("/resources", response_model=List[Resource])
async def get_resources(current_user: User = Depends(get_current_user)):
    resources = await db.resources.find().to_list(1000)
    return [Resource(**resource) for resource in resources]

@api_router.post("/resources", response_model=Resource)
async def create_resource(resource_data: ResourceCreate, current_user: User = Depends(get_current_user)):
    if current_user.access_level < 2:  # Manager level or above
        raise HTTPException(status_code=403, detail="Insufficient permissions to create resources")
    
    resource_dict = resource_data.dict()
    resource_dict["created_by"] = current_user.username
    resource = Resource(**resource_dict)
    
    await db.resources.insert_one(resource.dict())
    
    # Create access log
    access_log = AccessLog(
        user_id=current_user.username,
        user_name=current_user.full_name,
        action=f"Created Resource: {resource.name}",
        resource_id=resource.id,
        location="System",
        status="success"
    )
    await db.access_logs.insert_one(access_log.dict())
    
    return resource

@api_router.put("/resources/{resource_id}", response_model=Resource)
async def update_resource(resource_id: str, resource_data: ResourceCreate, current_user: User = Depends(get_current_user)):
    if current_user.access_level < 2:
        raise HTTPException(status_code=403, detail="Insufficient permissions to update resources")
    
    existing_resource = await db.resources.find_one({"id": resource_id})
    if not existing_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    updated_data = resource_data.dict()
    await db.resources.update_one({"id": resource_id}, {"$set": updated_data})
    
    updated_resource = await db.resources.find_one({"id": resource_id})
    
    # Create access log
    access_log = AccessLog(
        user_id=current_user.username,
        user_name=current_user.full_name,
        action=f"Updated Resource: {updated_resource['name']}",
        resource_id=resource_id,
        location="System",
        status="success"
    )
    await db.access_logs.insert_one(access_log.dict())
    
    return Resource(**updated_resource)

@api_router.delete("/resources/{resource_id}")
async def delete_resource(resource_id: str, current_user: User = Depends(get_current_user)):
    if current_user.access_level < 2:
        raise HTTPException(status_code=403, detail="Insufficient permissions to delete resources")
    
    resource = await db.resources.find_one({"id": resource_id})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    await db.resources.delete_one({"id": resource_id})
    
    # Create access log
    access_log = AccessLog(
        user_id=current_user.username,
        user_name=current_user.full_name,
        action=f"Deleted Resource: {resource['name']}",
        resource_id=resource_id,
        location="System",
        status="success"
    )
    await db.access_logs.insert_one(access_log.dict())
    
    return {"message": "Resource deleted successfully"}

# Dashboard routes
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    # Get counts
    total_resources = await db.resources.count_documents({})
    active_resources = await db.resources.count_documents({"status": "active"})
    maintenance_resources = await db.resources.count_documents({"status": "maintenance"})
    total_users = await db.users.count_documents({})
    active_alerts = await db.security_alerts.count_documents({"status": "active"})
    
    # Get recent access logs
    recent_access = await db.access_logs.find().sort("timestamp", -1).limit(5).to_list(5)
    
    # Get active alerts
    alerts = await db.security_alerts.find({"status": {"$in": ["active", "investigating"]}}).limit(10).to_list(10)
    
    return {
        "stats": {
            "total_resources": total_resources,
            "active_resources": active_resources, 
            "maintenance_resources": maintenance_resources,
            "total_users": total_users,
            "active_alerts": active_alerts,
            "security_level": "HIGH" if active_alerts > 0 else "NORMAL"
        },
        "recent_access": [AccessLog(**log) for log in recent_access],
        "active_alerts": [SecurityAlert(**alert) for alert in alerts]
    }

# Access logs routes
@api_router.get("/access-logs", response_model=List[AccessLog])
async def get_access_logs(current_user: User = Depends(get_current_user)):
    if current_user.access_level < 2:  # Manager level or above
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    logs = await db.access_logs.find().sort("timestamp", -1).limit(100).to_list(100)
    return [AccessLog(**log) for log in logs]

@api_router.post("/access-logs", response_model=AccessLog)
async def create_access_log(log_data: AccessLogCreate, current_user: User = Depends(get_current_user)):
    log = AccessLog(**log_data.dict())
    await db.access_logs.insert_one(log.dict())
    return log

# Security alerts routes
@api_router.get("/security-alerts", response_model=List[SecurityAlert])
async def get_security_alerts(current_user: User = Depends(get_current_user)):
    alerts = await db.security_alerts.find().sort("created_at", -1).limit(50).to_list(50)
    return [SecurityAlert(**alert) for alert in alerts]

@api_router.post("/security-alerts", response_model=SecurityAlert)
async def create_security_alert(alert_data: SecurityAlertCreate, current_user: User = Depends(get_current_user)):
    if current_user.access_level < 2:  # Manager level or above
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    alert = SecurityAlert(**alert_data.dict())
    await db.security_alerts.insert_one(alert.dict())
    return alert

@api_router.put("/security-alerts/{alert_id}")
async def update_alert_status(alert_id: str, status: str, current_user: User = Depends(get_current_user)):
    if current_user.access_level < 2:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    update_data = {"status": status}
    if status == "resolved":
        update_data["resolved_at"] = datetime.utcnow()
    
    await db.security_alerts.update_one({"id": alert_id}, {"$set": update_data})
    return {"message": "Alert updated successfully"}

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "online", "service": "Wayne Industries Security System"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    await init_default_data()
    logger.info("Wayne Industries Security System initialized")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()