# test_db_connection.py - Test MongoDB connection
from database import connect_db, get_db, close_db

def test_connection():
    """Test MongoDB connection"""
    try:
        print("Testing MongoDB connection...")
        db = connect_db()
        
        # List collections
        collections = db.list_collection_names()
        print(f"SUCCESS: Available collections: {collections if collections else 'None (database is empty)'}")
        
        # Test simple operation
        test_doc = {"test": "connection"}
        result = db.test_collection.insert_one(test_doc)
        print(f"SUCCESS: Test insert successful: {result.inserted_id}")
        
        # Clean up test document
        db.test_collection.delete_one({"_id": result.inserted_id})
        print("SUCCESS: Test cleanup successful")
        
        print("\n==> MongoDB connection is working perfectly!")
        return True
        
    except Exception as e:
        print(f"\nERROR: Connection failed: {e}")
        return False
    
    finally:
        close_db()

if __name__ == "__main__":
    test_connection()

