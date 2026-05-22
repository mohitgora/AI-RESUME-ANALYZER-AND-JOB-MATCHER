import sqlite3

conn = sqlite3.connect("resume.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resume TEXT,
    category TEXT
)
""")

conn.commit()