# Admin API Usage Examples

Base URL: `http://localhost:5000`

## 1. Authentication (Login as Admin)
You must login first to get the `token`.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "_id": "65b...",
  "name": "Admin",
  "email": "admin@example.com",
  "type": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
*Copy the `token` from the response for the next steps.*

---

## 2. Add Station
**Endpoint:** `POST /api/admin/stations`

**Headers:**
- `Content-Type`: `application/json`
- `Authorization`: `Bearer <YOUR_ADMIN_TOKEN>`

**Request Body:**
```json
{
  "name": "Central Station",
  "lines": [
    {
      "line": "Red Line",
      "sequence": 1
    },
    {
      "line": "Blue Line",
      "sequence": 5
    }
  ],
  "isInterchange": true
}
```

**Success Response (201):**
```json
{
  "_id": "65b...",
  "name": "Central Station",
  "lines": [...],
  "isInterchange": true
}
```

---

## 3. Delete Station
**Endpoint:** `DELETE /api/admin/stations/:id`
*(Replace `:id` with the actual station ID, e.g., `65b...`)*

**Headers:**
- `Content-Type`: `application/json`
- `Authorization`: `Bearer <YOUR_ADMIN_TOKEN>`

**Success Response (200):**
```json
{
  "message": "Station removed"
}
```
