import firebase_admin
from firebase_admin import credentials, storage, db

from typing import Union
from fastapi import FastAPI
import psycopg2

import time
import json


cred = credentials.Certificate("/secrets/cred.json")
firebase_admin.initialize_app(cred)
app = FastAPI()
conn = psycopg2.connect(database="db_name",
                        host="db_host",
                        user="db_user",
                        password="db_pass",
                        port="db_port")

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


