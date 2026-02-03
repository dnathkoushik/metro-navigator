# Metro Navigator Backend

The backend service for the Metro Navigator application, built with Node.js, Express, and MongoDB. This service handles user authentication, station management, and intelligent pathfinding algorithms.

## 🚀 Key Features

*   **User Authentication**: Secure registration and login using JWT.
*   **Station Management**: API to retrieve all metro stations.
*   **Intelligent Pathfinding**:
    *   **Minimum Stations**: Finds the path with the fewest stops (BFS).
    *   **Minimum Time**: Finds the quickest path considering travel time and transfer penalties (Dijkstra).
    *   **Minimum Distance**: Finds the shortest physical path (Dijkstra).
*   **Admin Dashboard**:
    *   **Station Management**: Add or remove stations dynamically.
    *   **User Management**: Block/Unblock users to restrict access.

## 🛠️ Tech Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB
*   **ODM**: Mongoose
*   **Authentication**: JSON Web Tokens (JWT) & bcryptjs
*   **Validation**: Joi

## 📦 Getting Started

### Prerequisites

*   Node.js (v14+)
*   MongoDB (Local or Atlas)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/dnathkoushik/metro-navigator.git
    cd metro-navigator/backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the `backend` root and add:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

4.  Seed the Database (Optional):
    Populate the database with initial station data.
    ```bash
    npm run data:import
    ```

5.  Run the server:
    ```bash
    npm run dev
    ```

## 📚 API Documentation (User Side)

All endpoints are prefixed with `/api`.

### 1. Authentication

| Method | Endpoint | Description | Auth Required | Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | No | `{ "name": "John", "email": "john@example.com", "password": "pass" }` |
| `POST` | `/auth/login` | Login user & get token | No | `{ "email": "john@example.com", "password": "pass" }` |
| `GET` | `/auth/profile` | Get current user details | **Yes** | N/A |

### 2. Stations

| Method | Endpoint | Description | Auth Required | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/stations` | Get list of all stations | No | `[ { "name": "Station A", ... }, ... ]` |

### 3. Path Finding

All path finding endpoints require a valid JWT token in the `Authorization` header (`Bearer <token>`).

| Method | Endpoint | Query Type | Description | Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/path/min-stations` | **Min Stations** | Path with fewest stops | `{ "from": "Station A", "to": "Station B" }` |
| `POST` | `/path/min-time` | **Min Time** | Quickest path (time-weighted) | `{ "from": "Station A", "to": "Station B" }` |
| `POST` | `/path/min-distance` | **Min Distance** | Shortest physical distance | `{ "from": "Station A", "to": "Station B" }` |

### 4. Admin Management

All admin endpoints require a valid **Admin Token** in the `Authorization` header.

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/admin/stations` | Add a new station | `{ "name": "Station X", "lines": [{"line": "Red", "sequence": 10}] }` |
| `DELETE` | `/admin/stations/:id` | Delete a station | N/A |
| `PUT` | `/admin/users/:id/block` | Block/Unblock a user | N/A |

## 🏗️ Folder Structure

```
backend/
├── config/         # Database configuration
├── controllers/    # API Logic (Auth, Path, Station)
├── middleware/     # Auth & Validation Middleware
├── models/         # Mongoose Models (User, Station)
├── routes/         # API Route definitions
├── utils/          # Helper functions (Token generation)
├── seeder.js       # Script to seed database
└── server.js       # Entry point
```

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
