# API Documentation

Base URL: `http://localhost/api`

## Authentication

API menggunakan Laravel Sanctum untuk authentication. Anda perlu login terlebih dahulu untuk mendapatkan token.

### Login (Web-based)
Login melalui web interface di `/login` dengan credentials:
- Email: `test@example.com`
- Password: `password`

Setelah login, Sanctum akan menggunakan session cookies untuk authentication.

## Endpoints

### Suppliers

#### GET /api/suppliers
List semua suppliers dengan pagination.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "AudioInfinite",
      "desc": "Premium audio equipment and accessories supplier",
      "products_count": 5,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "links": {...},
  "meta": {...}
}
```

#### GET /api/suppliers/{id}
Detail supplier dengan products.

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "AudioInfinite",
    "desc": "Premium audio equipment and accessories supplier",
    "products": [...],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

#### POST /api/suppliers
Create supplier baru.

**Request Body:**
```json
{
  "name": "New Supplier",
  "desc": "Description here"
}
```

**Response:**
```json
{
  "message": "Supplier berhasil ditambahkan.",
  "data": {
    "id": 3,
    "name": "New Supplier",
    "desc": "Description here",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

#### PUT /api/suppliers/{id}
Update supplier.

**Request Body:**
```json
{
  "name": "Updated Supplier",
  "desc": "Updated description"
}
```

#### DELETE /api/suppliers/{id}
Delete supplier.

**Response:**
```json
{
  "message": "Supplier berhasil dihapus."
}
```

---

### Products

#### GET /api/products
List semua products dengan pagination.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "supplier_id": 1,
      "supplier": {
        "id": 1,
        "name": "AudioInfinite",
        "desc": "Premium audio equipment"
      },
      "galleries": [...],
      "galleries_count": 3,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "links": {...},
  "meta": {...}
}
```

#### GET /api/products/{id}
Detail product dengan supplier dan galleries.

#### POST /api/products
Create product baru.

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "supplier_id": 1
}
```

**Validation:**
- `name`: required, string, max 255
- `description`: nullable, string
- `supplier_id`: required, exists in suppliers table

#### PUT /api/products/{id}
Update product.

#### DELETE /api/products/{id}
Delete product (cascade delete galleries).

---

### Product Galleries

#### GET /api/product-galleries
List semua galleries dengan pagination.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "file_path": "images/product1.jpg",
      "product_id": 1,
      "order": 0,
      "product": {...},
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "links": {...},
  "meta": {...}
}
```

#### GET /api/product-galleries/{id}
Detail gallery dengan product.

#### POST /api/product-galleries
Create gallery baru.

**Request Body:**
```json
{
  "file_path": "images/product1.jpg",
  "product_id": 1,
  "order": 0
}
```

**Validation:**
- `file_path`: required, string, max 255
- `product_id`: required, exists in products table
- `order`: nullable, integer, min 0

#### PUT /api/product-galleries/{id}
Update gallery.

#### DELETE /api/product-galleries/{id}
Delete gallery.

---

## Error Responses

### Validation Error (422)
```json
{
  "message": "The name field is required.",
  "errors": {
    "name": ["The name field is required."]
  }
}
```

### Not Found (404)
```json
{
  "message": "No query results for model [App\\Models\\Product] 999"
}
```

### Unauthorized (401)
```json
{
  "message": "Unauthenticated."
}
```

## Testing API

### Using cURL

```bash
# Login first via web, then use cookies

# Get suppliers
curl -X GET http://localhost/api/suppliers \
  -H "Accept: application/json" \
  --cookie-jar cookies.txt

# Create supplier
curl -X POST http://localhost/api/suppliers \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  --cookie cookies.txt \
  -d '{"name":"Test Supplier","desc":"Test description"}'
```

### Using Postman

1. Login via web browser first
2. Copy session cookie
3. Add cookie to Postman requests
4. Set `Accept: application/json` header
