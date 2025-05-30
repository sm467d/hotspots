import os
from datetime import datetime
from dotenv import load_dotenv
from pymongo import MongoClient
import random

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI')
DB_NAME = os.getenv('DB_NAME')
NUM_DETECTIONS = 100

def generate_detections():
    try:
        # Connect to MongoDB
        print(f"Attempting to connect to MongoDB...")
        print(f"MONGO_URI: {MONGO_URI[:20]}..." if MONGO_URI else "MONGO_URI not set")
        print(f"DB_NAME: {DB_NAME}" if DB_NAME else "DB_NAME not set")
        
        if not MONGO_URI:
            raise ValueError("MONGO_URI environment variable is not set")
        if not DB_NAME:
            raise ValueError("DB_NAME environment variable is not set")
            
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        # Test the connection
        client.server_info()
        print("Successfully connected to MongoDB")
        
        db = client[DB_NAME]
        detections_collection = db.detections

        # Clear existing detections
        detections_collection.delete_many({})
        print("Cleared existing detections")

        # Generate sample detections
        detections = []
        for _ in range(NUM_DETECTIONS):
            detection = {
                "cell": {
                    "x": random.randint(0, 999),
                    "y": random.randint(0, 999)
                },
                "fires": [{
                    "probability": 1.0,  # All probabilities set to 1
                    "size": random.randint(1, 10),  # Random size between 1 and 10
                    "severity": 0  # All severities set to 0
                }],
                "detectionSeverity": 0,  # Overall severity set to 0
                "status": "Active",  # All status set to Active
                "timestamp": datetime.utcnow()
            }
            detections.append(detection)

        # Insert all detections
        result = detections_collection.insert_many(detections)
        print(f"Successfully inserted {len(result.inserted_ids)} detections")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Close the MongoDB connection
        client.close()
        print("Disconnected from MongoDB")

if __name__ == "__main__":
    generate_detections()
