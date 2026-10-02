@echo off
cd /d "C:\Users\VEDAN\OneDrive\Desktop\Inventory-Management-System"
call venv\Scripts\activate
start "" http://127.0.0.1:5000/
python app.py
pause
