@'
# Inventory Management System

A full-stack web-based Inventory Management System developed using **Python Flask, SQLite, HTML, CSS, and JavaScript**.

## Features

- Add new products
- View all products
- Search products by ID, name, or category
- Update product quantity and price
- Delete products
- Low-stock alerts
- Out-of-stock detection
- Dashboard with inventory statistics
- REST API using GET, POST, PUT, and DELETE
- SQLite database
- Responsive web interface
- One-click application launcher

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python Flask
- **Database:** SQLite
- **API:** REST API
- **Tools:** VS Code, Git, GitHub

## Product Information

Each product contains:

- Product ID
- Product Name
- Category
- Quantity
- Price

## Stock Management

The system automatically identifies:

- **Low Stock:** Quantity ≤ 5
- **Out of Stock:** Quantity = 0

Negative quantity and price values are not allowed.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/products` | View all products |
| POST | `/api/products` | Add a product |
| PUT | `/api/products/<product_id>` | Update product |
| DELETE | `/api/products/<product_id>` | Delete product |

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/vedantraut303-maker/Inventory-Management-System.git