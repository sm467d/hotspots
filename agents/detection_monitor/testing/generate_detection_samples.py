import os
from datetime import datetime
from dotenv import load_dotenv
from pymongo import MongoClient
import random

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI')
NUM_DETECTIONS = 100

def generate_detections():
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URI)
        db = client.get_default_database()
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
