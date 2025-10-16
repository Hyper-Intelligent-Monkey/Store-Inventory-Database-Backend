# Store/Inventory Management API

An inventory management database backend built using Node.js, Express, and MongoDB. Manages Products, Suppliers, Orders, and Users with full CRUD operations.

### By:
Vinn Runkee Cañares  
BSCS 4-2

### Requirements
- Node.js 18+ 
- MongoDB Atlas
- Code Editor (Command-line Environment)
- Git Bash (Optional Command-line Environment)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in project root:
   ```bash
   MONGO_URI=mongodb://127.0.0.1:27017/inventory
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start        # Production
   npm run start      # Development with nodemon
   ```

## Project Structure

```
Inventory_Store/
├── app.js                    # Server
├── config/
│   └── db.js                 # Database connection
├── controllers/              # Database Management Logic
│   ├── supplierController.js
│   ├── orderController.js
│   └── productController.js
├── models/                   # Collection schemas
│   ├── productModel.js
│   ├── supplierModels.js
│   └── orderModel.js
├── routes/                   # API route
│   ├── productRoutes.js
│   ├── supplierRoutes.js
│   └── orderRoutes.js
├── package.json
└── README.md
```

## CRUD

### Product
- `POST /product` - Create new product
- `GET /products` - Get all products
- `GET /product/:id` - Get product by ID
- `PUT /product/:id` - Update product
- `DELETE /product/:id` - Delete product

### Supplier
- `POST /supplier` - Create new supplier
- `GET /suppliers` - Get all suppliers
- `GET /supplier/:id` - Get supplier by ID
- `PUT /supplier/:id` - Update supplier
- `DELETE /supplier/:id` - Delete supplier

### Order
- `POST /order` - Create new order
- `GET /orders` - Get all orders (with populated references)
- `GET /order/:id` - Get order by ID
- `PUT /order/:id` - Update order
- `DELETE /order/:id` - Delete order

## Data Models

### Product
```json
{
  "sku": "string (required, unique)",
  "name": "string (required)",
  "price": "number (min: 0, required)",
  "stock": "number (min: 0, default: 0, required)"
}
```

### Supplier
```json
{
  "name": "string (required)",
  "contact": "string (required, unique)"
}
```

### Order
```json
{
  "supplierId": "ObjectId (required)",
  "items": [
    {
      "productId": "ObjectId (required)",
      "qty": "number (min: 1, required)",
      "price": "number (min: 0, required)" 
    }
  ],
  "status": "string (enum: pending, approved, shipped, received, cancelled)"
}
```
