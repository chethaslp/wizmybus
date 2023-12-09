import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.base_query import FieldFilter
import psycopg2
import json

cred = credentials.Certificate("./secrets/cred.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# conn = psycopg2.connect(database = "postgres", user = "postgres", password = "chethas123", host = "localhost", port = "5432")
# cur = conn.cursor()
# cur2 = conn.cursor()
# cur.execute("SELECT * from bus_list")
# rowss = cur.fetchall()

# for i in rowss:
#     cur2.execute("SELECT * from route_"+str(i[4]))
#     a = []
#     for p in cur2.fetchall():
#         a.append(p[1])
#     doc_ref = db.collection("bus").document(str(i[4]))
#     doc_ref.set({
#         'n':i[1],
#         'ty':i[-1],
#         'v':i[3],
#         'r':i[7].split(' - '),
#         't':a,
#         'l': [0,0],
#         'tf':[i[5],i[6]]
#     })
#     print(i[4],":",i[1])

searchkey = "KASARAGOD BS (KGD)"
docs = (
    db.collection("bus")
    .order_by('r')
    .start_at([searchkey])
    .end_at([searchkey + '\uf8ff'])
    .stream()
)

for doc in docs:
    print(f"{doc.id} => {doc.to_dict()}")







