import pymysql

# Replace with your MySQL username and password
conn = pymysql.connect(host="localhost", user="aryan", password="password")

# Create a cursor
cursor = conn.cursor()

# Create the database if it doesn't exist
cursor.execute("CREATE DATABASE IF NOT EXISTS aidropout")

# Close connections
cursor.close()
conn.close()

print("Database created successfully (or already exists).")
