# Product Admin Panel

A modern, enterprise-ready product management system built with Laravel 12 and React 19. This project serves as both a web-based admin panel and a backend API for managing products (devices) for company use. It provides a RESTful API that can be consumed by frontend applications (like landing pages) to display product information.

## 🚀 Overview

This project is a **full-stack web application** that combines:
- **Admin Panel**: A secure, feature-rich web interface for managing products
- **Backend API**: RESTful endpoints to serve product data to external applications
- **Authentication System**: Complete user authentication with 2FA support
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🛠️ Technology Stack

### Backend
- **Laravel 12** (PHP 8.2) - Modern PHP framework
- **Laravel Fortify** - Headless authentication backend
- **Laravel Wayfinder** - Type-safe route generation for TypeScript
- **MySQL/SQLite** - Database options

### Frontend
- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe JavaScript
- **Inertia.js v2** - Server-side routing with client-side components (SPA)
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Vite** - Fast build tool and dev server

### Development Tools
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Laravel Pint** - PHP code style fixer
- **PHPUnit** - PHP testing framework

## 📋 Features

### Completed Features
- ✅ User Authentication (Login, Register, Email Verification)
- ✅ Password Reset
- ✅ Two-Factor Authentication (2FA) with recovery codes
- ✅ User Profile Management
- ✅ Settings & Preferences (Theme, Appearance)
- ✅ Secure Dashboard
- ✅ Product Model & Database Schema

### In Development
- 🔨 Product CRUD Operations
- 🔨 Product API Endpoints
- 🔨 Product Categories
- 🔨 Image Upload & Management
- 🔨 Search & Filtering

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:
- **PHP** >= 8.2
- **Composer** >= 2.0
- **Node.js** >= 18.x
- **npm** >= 9.x
- **MySQL** >= 8.0 or **SQLite**

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/AsadCus/product-admin-panel.git
cd product-admin-panel
```

### 2. Automated Setup
Run the automated setup script:
```bash
composer run setup
```

This will:
- Install PHP dependencies
- Create `.env` file from `.env.example`
- Generate application key
- Run database migrations
- Install JavaScript dependencies
- Build frontend assets

### 3. Manual Setup (Alternative)

If you prefer manual setup:

#### Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

#### Configure Environment
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database settings in .env
# Edit DB_CONNECTION, DB_DATABASE, etc.
```

#### Database Setup
```bash
# Run migrations
php artisan migrate

# (Optional) Seed database with sample data
php artisan db:seed
```

#### Build Frontend Assets
```bash
# Build for production
npm run build

# Or run development server
npm run dev
```

## 🚀 Running the Application

### Development Mode

#### Option 1: All-in-One (Recommended)
```bash
composer run dev
```

This starts:
- Laravel development server (http://localhost:8000)
- Queue worker
- Vite dev server (with HMR)

#### Option 2: Individual Commands
In separate terminal windows:
```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Queue worker
php artisan queue:work

# Terminal 3: Vite dev server
npm run dev
```

### Production Mode

```bash
# Build optimized assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start with a process manager (PM2, Supervisor, etc.)
php artisan serve --host=0.0.0.0 --port=8000
```

## 🔌 API Documentation

### API Endpoints for Product Data

The following API endpoints are available for external applications (e.g., landing pages) to consume product data:

#### Get All Products
```http
GET /api/products
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product Description",
      "price": 99.99,
      "category": "Electronics",
      "image_url": "https://example.com/image.jpg",
      "created_at": "2026-02-07T12:00:00.000000Z",
      "updated_at": "2026-02-07T12:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 50
  }
}
```

#### Get Single Product
```http
GET /api/products/{id}
```

#### Create Product (Admin Only)
```http
POST /api/products
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "category": "Electronics"
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/{id}
Content-Type: application/json
Authorization: Bearer {token}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/{id}
Authorization: Bearer {token}
```

### CORS Configuration

To allow your React landing page to consume the API, configure CORS in `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_origins' => ['https://your-landing-page.com'],
```

## 🧪 Testing

### Run All Tests
```bash
composer test
```

### Run Specific Test Suites
```bash
# PHP tests only
php artisan test

# Frontend type checking
npm run types

# Linting
npm run lint        # JavaScript/TypeScript
composer run lint   # PHP
```

## 📝 Code Quality

### Formatting
```bash
# Format JavaScript/TypeScript
npm run format

# Check formatting
npm run format:check

# Format PHP
composer run lint
```

### Linting
```bash
# Lint and fix JavaScript/TypeScript
npm run lint

# Test PHP linting
composer run test:lint
```

## 🗂️ Project Structure

```
product-admin-panel/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── ProductController.php    # Product CRUD operations
│   └── Models/
│       ├── User.php                     # User model
│       └── Product.php                  # Product model
├── database/
│   ├── migrations/                      # Database migrations
│   └── seeders/                         # Database seeders
├── resources/
│   └── js/
│       ├── components/                  # Reusable React components
│       ├── pages/                       # Inertia pages
│       ├── layouts/                     # Layout components
│       └── hooks/                       # Custom React hooks
├── routes/
│   ├── web.php                          # Web routes
│   ├── api.php                          # API routes
│   └── settings.php                     # Settings routes
├── public/                              # Public assets
├── storage/                             # Storage directory
└── tests/                               # Test files
```

## 🔐 Authentication

This application uses **Laravel Fortify** for authentication. Fortify provides:

- Registration
- Login
- Email Verification
- Password Reset
- Two-Factor Authentication (TOTP)
- Profile Management

### Default Authentication Routes

- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset request
- `/verify-email` - Email verification
- `/settings/two-factor` - 2FA setup

## 🌐 Deployment

### Environment Configuration

1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false`
3. Configure your production database
4. Set up proper `APP_URL`
5. Configure mail settings for production

### Optimization

```bash
# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Build production assets
npm run build
```

### Web Server Configuration

#### Apache
Enable `mod_rewrite` and point document root to `/public`

#### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow PSR-12 for PHP code
- Use ESLint/Prettier for JavaScript/TypeScript
- Write tests for new features
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change port in .env or use different port
php artisan serve --port=8001
```

**Database connection error:**
- Check database credentials in `.env`
- Ensure database server is running
- Verify database exists

**Node modules error:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Composer dependencies error:**
```bash
rm -rf vendor composer.lock
composer install
```

## 📄 License

This project is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 👥 Authors

- **AsadCus** - Initial work

## 🙏 Acknowledgments

- Laravel Framework
- React Team
- Inertia.js
- Tailwind CSS
- All contributors and supporters

## 📞 Support

For support, please open an issue in the [GitHub repository](https://github.com/AsadCus/product-admin-panel/issues).

---

**Built with ❤️ using Laravel and React**
