from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from database import connect, create_user, initialize_db
import os
from dotenv import load_dotenv
from routes import router as apiRouter

load_dotenv()

conn = connect()
cursor = conn.cursor()

app = FastAPI()

api_app = FastAPI()

origins = os.getenv("CORS_ORIGINS").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    initialize_db()

    # user_id = create_user(
    #     or_no="123456789",
    #     role="committee",
    #     station="Registration",
    #     name="Juan Dela Cruz",
    # )

    # print(user_id)


api_app.include_router(router=apiRouter, tags=["API"])

app.mount("/api", api_app, name="api")

app.mount("/", StaticFiles(directory="../build", html=True), name="build")

templates = Jinja2Templates(directory="../build")


@app.exception_handler(404)
async def catch_all(request: Request, exc: HTTPException):
    return templates.TemplateResponse("index.html", {"request": request})

