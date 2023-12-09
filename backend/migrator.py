import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
import psycopg2

import json


conn = psycopg2.connect(database = "postgres", user = "postgres", password = "chethas123", host = "localhost", port = "5432")
cur = conn.cursor()
cur2 = conn.cursor()
cur3 = conn.cursor()
cur.execute("SELECT * from bus_list")
rowss = cur.fetchall()

with open("casc.sql",'a') as f:
    for i in rowss:
        cur2.execute("SELECT * from route_"+str(i[4]))
        a = []
        for p in cur2.fetchall():
            a.append(p[1])
        f.write("UPDATE bus_list SET timing ='"+ " - ".join(a) + "' where bus_code='"+str(i[4])+"'")

        # cur3.execute("UPDATE bus_list SET timing ='"+ " - ".join(a) + "' where bus_code='"+str(i[4])+"'")
        print(i[4],":",i[1])

# searchkey = "KASARAGOD BS (KGD)"
# docs = (
#     db.collection("bus")
#     .order_by('r')
#     .start_at([searchkey])
#     .end_at([searchkey + '\uf8ff'])
#     .stream()i[4]
# )

# for doc in docs:
#     print(f"{doc.id} => {doc.to_dict()}")







