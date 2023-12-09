import firebase_admin
from firebase_admin import credentials, firestore
import time
# Initialize Firebase Admin SDK
cred = credentials.Certificate("./backend/secret/cred.json")
firebase_admin.initialize_app(cred)

# Create a Firestore client
db = firestore.client()
# Reference to the "bus" collection
bus_collection = db.collection("bus")


doc_ref = bus_collection.document('13645')
doc_data = doc_ref.get().to_dict()


# print(doc_data['l'][0])

def main():
    if 'l' in doc_data and len(doc_data['l']) > 0:
        
        zero = float(doc_data['l'][0])
        one = float(doc_data['l'][1])
        
        doc_data['l'][0] = zero + 0.01
        doc_data['l'][1] = one + 0.01

    # Update the document with the modified data
        doc_ref.update({'l': doc_data['l']})
        print(f"Document with ID '1345' updated successfully.")
    else:
        print("The 'l' field does not exist or is empty.")
        
while True:
    main()
    time.sleep(1)