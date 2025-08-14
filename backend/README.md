# Katsina Local Government - Backend API

## Overview
This is the backend API for the Katsina Local Government website and admin dashboard. It provides authentication, content management, and public data endpoints.

## Features
- 🔐 JWT Authentication with role-based access control
- 📊 Opportunity management (CRUD operations)
- 📸 Media upload and management with Cloudinary
- 👥 User management
- 📈 Public API for frontend polling
- 🔒 Security middleware (Helmet, CORS, Rate Limiting)

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install