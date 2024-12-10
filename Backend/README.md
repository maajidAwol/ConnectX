# ConnectX Backend

ConnectX is a Django-based backend application designed to manage users, products, orders, and transactions for an e-commerce platform.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/maajidAwol/ConnectX.git
   cd ConnectX/Backend
   ```

2. **Set up a virtual environment:**
   ```bash
   pipenv install
   ```

3. **Activate the virtual environment:**
   ```bash
   pipenv shell
   ```

4. **Install dependencies from Pipfile.lock:**
   ```bash
   pipenv install --ignore-pipfile
   ```

5. **Apply migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

## Usage

Once the server is running, you can access the API at `http://127.0.0.1:8000/`. You can use tools like Postman or cURL to interact with the API endpoints.

## Features

- User management with roles (Admin, Entrepreneur, Customer)
- Product management with categories
- Order processing and management
- Transaction logging for sales, restocks, and returns