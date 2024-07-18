# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# from dotenv import load_dotenv

# load_dotenv()
# import os
# DB_URL = DB_URL = os.getenv("DB_URL")
# engine = create_engine(DB_URL,echo=True)
# SessionLocal = sessionmaker(autocommit=False,autoflush=False, bind=engine)

# Base = declarative_base()


import mysql.connector
from dotenv import load_dotenv
import os
from datetime import date

load_dotenv()

MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DB = os.getenv("MYSQL_DB")


# Connect to MySQL
def connect():
    return mysql.connector.connect(
        host=MYSQL_HOST, user=MYSQL_USER, password=MYSQL_PASSWORD, database=MYSQL_DB
    )


def initialize_db():
    conn = connect()
    cursor = conn.cursor()
    query = """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        or_no VARCHAR(255),
        name VARCHAR(255),
        role VARCHAR(255),
        station VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
    """
    cursor.execute(query)
    
    query = """
    CREATE TABLE IF NOT EXISTS entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        or_no VARCHAR(255),
        name VARCHAR(255),
        station VARCHAR(255),
        conference_date DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
    """
    cursor.execute(query)
    
    conn.close()


def create_user(or_no, name, role, station):
    conn = connect()
    cursor = conn.cursor()
    query = "INSERT INTO users (or_no, name, role, station) VALUES (%s, %s, %s, %s)"
    values = (or_no, name, role, station)

    cursor.execute(query, values)

    conn.commit()
    conn.close()
    return cursor.lastrowid


def fetch_committee(or_no):
    conn = connect()
    cursor = conn.cursor()
    
    query = f"""
    SELECT or_no, name, role, station FROM users 
    WHERE or_no = '{or_no}' AND role = 'committee'
    """
    
    print(query)

    
    cursor.execute(query)
    result = cursor.fetchall()
    
    conn.close()
    
    return result

def fetch_participant(or_no):
    conn = connect()
    cursor = conn.cursor()
    
    query = f"""
    SELECT or_no, name, role, station FROM users 
    WHERE or_no = '{or_no}' AND role = 'participant'
    """
    
    cursor.execute(query)
    result = cursor.fetchall()
    
    conn.close()
    
    return result

def fetch_entry(or_no, station):
    conn = connect()
    cursor = conn.cursor()
    
    query = f"""
    SELECT or_no, name, station FROM entries 
    WHERE or_no = '{or_no}' AND station = '{station}'
    """
    
    cursor.execute(query)
    result = cursor.fetchall()
    
    conn.close()
    
    return result


from datetime import date, datetime, timezone, timedelta


def insert_one_entry(or_no, name, station):
    
    ph_time = timezone(timedelta(hours=8))

    current_time_ph = datetime.now(ph_time).strftime("%Y-%m-%d %H:%M:%S")
    
    conn = connect()
    cursor = conn.cursor()
    query = "INSERT INTO entries (or_no, name, station, conference_date) VALUES (%s, %s, %s, %s)"
    values = (or_no, name, station, str(current_time_ph))

    cursor.execute(query, values)

    conn.commit()
    conn.close()
    return cursor.lastrowid