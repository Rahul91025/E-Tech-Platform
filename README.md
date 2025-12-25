# Learn Mama Backend

Backend API for Learn Mama - Test Series & Resource Platform. This platform allows students to take tests, teachers to create and manage tests, and admins to oversee the system.

## Features

- User authentication (JWT and Google OAuth)
- Role-based access control (Student, Teacher, Admin)
- Test series creation and management
- Question management
- Test attempts and scoring
- Subscription management with payment integration (Razorpay/Stripe)
- Analytics for teachers and admins
- Admin dashboard and user management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT, Passport.js (Google OAuth)
- **Validation**: Joi
- **Payments**: Razorpay, Stripe
- **Rate Limiting**: express-rate-limit
- **Testing**: Jest, Supertest

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd learn-mama-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (create a `.env` file in the root directory):
   ```
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=learn_mama
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Set up the database:
   - Create a MySQL database named `learn_mama`
   - Run migrations (if using Sequelize CLI):
     ```bash
     npx sequelize-cli db:migrate
     ```

5. Start the server:
   ```bash
   npm run dev  # For development with nodemon
   # or
   npm start    # For production
   ```

## Docker Setup

### Prerequisites
- Docker and Docker Compose installed on your system

### Running with Docker Compose

1. Clone the repository and navigate to the project directory

2. Create a `.env` file in the root directory with the required environment variables (same as above, but adjust DB_HOST and REDIS_URL for Docker):
   ```
   NODE_ENV=production
   PORT=3000
   DB_HOST=mysql
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=learn_mama
   REDIS_URL=redis://redis:6379
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

3. Build and start the services:
   ```bash
   docker-compose up --build
   ```

4. The application will be available at `http://localhost:3000`

### Services
- **app**: Node.js application
- **mysql**: MySQL database
- **redis**: Redis cache

### Stopping the Services
```bash
docker-compose down
```

### Viewing Logs
```bash
docker-compose logs -f app
```

## API Documentation

Base URL: `http://localhost:3000/api/v1`

All requests (except auth endpoints) require an Authorization header: `Bearer <token>`

### Authentication

#### Register User
- **Endpoint**: `POST /auth/register`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "STUDENT"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### Login User
- **Endpoint**: `POST /auth/login`
- **Description**: Login user
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### Google OAuth
- **Endpoint**: `GET /auth/google`
- **Description**: Initiate Google OAuth login
- **Response**: Redirects to Google

- **Endpoint**: `GET /auth/google/callback`
- **Description**: Google OAuth callback
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Tests

#### Get Tests
- **Endpoint**: `GET /tests/`
- **Description**: Get list of test series (paginated)
- **Query Params**: `page`, `limit`
- **Response**:
  ```json
  {
    "tests": [
      {
        "id": 1,
        "title": "Math Test Series",
        "description": "Basic math questions",
        "isPaid": false,
        "price": 0,
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

#### Create Test Series
- **Endpoint**: `POST /tests/`
- **Description**: Create a new test series (Teacher only)
- **Request Body**:
  ```json
  {
    "title": "New Test Series",
    "description": "Description of the test",
    "isPaid": true,
    "price": 100
  }
  ```
- **Response**:
  ```json
  {
    "id": 2,
    "title": "New Test Series",
    "description": "Description of the test",
    "isPaid": true,
    "price": 100,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
  ```

#### Get Test Series
- **Endpoint**: `GET /tests/:id`
- **Description**: Get a specific test series
- **Response**:
  ```json
  {
    "id": 1,
    "title": "Math Test Series",
    "description": "Basic math questions",
    "isPaid": false,
    "price": 0,
    "questions": [
      {
        "id": 1,
        "questionText": "What is 2+2?",
        "options": {
          "A": "3",
          "B": "4",
          "C": "5",
          "D": "6"
        },
        "correctOption": "B"
      }
    ]
  }
  ```

#### Update Test Series
- **Endpoint**: `PUT /tests/:id`
- **Description**: Update a test series (Teacher only)
- **Request Body**: Same as create
- **Response**: Same as create

#### Delete Test Series
- **Endpoint**: `DELETE /tests/:id`
- **Description**: Delete a test series (Teacher only)
- **Response**: 204 No Content

#### Approve Test Series
- **Endpoint**: `PUT /tests/:id/approve`
- **Description**: Approve a test series (Admin only)
- **Response**:
  ```json
  {
    "message": "Test series approved"
  }
  ```

#### Get Questions
- **Endpoint**: `GET /tests/:id/questions`
- **Description**: Get questions for a test series (Teacher/Admin only)
- **Response**:
  ```json
  [
    {
      "id": 1,
      "questionText": "What is 2+2?",
      "options": {
        "A": "3",
        "B": "4",
        "C": "5",
        "D": "6"
      },
      "correctOption": "B"
    }
  ]
  ```

### Admin

#### Get Dashboard
- **Endpoint**: `GET /admin/dashboard`
- **Description**: Get admin dashboard data (Admin only)
- **Response**:
  ```json
  {
    "totalUsers": 100,
    "totalTests": 50,
    "totalRevenue": 5000,
    "recentActivity": [...]
  }
  ```

#### Get Users
- **Endpoint**: `GET /admin/users`
- **Description**: Get list of users (Admin only)
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "isActive": true,
      "isApproved": true
    }
  ]
  ```

#### Approve Teacher
- **Endpoint**: `PUT /admin/approve-teacher/:id`
- **Description**: Approve a teacher (Admin only)
- **Response**:
  ```json
  {
    "message": "Teacher approved"
  }
  ```

#### Get Test Series
- **Endpoint**: `GET /admin/test-series`
- **Description**: Get all test series (Admin only)
- **Response**: Array of test series objects

#### Approve Test
- **Endpoint**: `PUT /admin/approve-test/:id`
- **Description**: Approve a test series (Admin only)
- **Response**:
  ```json
  {
    "message": "Test approved"
  }
  ```

#### Get Analytics
- **Endpoint**: `GET /admin/analytics`
- **Description**: Get analytics data (Admin only)
- **Response**:
  ```json
  {
    "userGrowth": [...],
    "testPerformance": [...],
    "revenueTrends": [...]
  }
  ```

#### Get Revenue
- **Endpoint**: `GET /admin/revenue`
- **Description**: Get revenue data (Admin only)
- **Response**:
  ```json
  {
    "totalRevenue": 5000,
    "monthlyRevenue": [...],
    "paymentMethods": [...]
  }
  ```

### Teacher

#### Add Question
- **Endpoint**: `POST /teacher/questions/:testId`
- **Description**: Add a question to a test series (Approved Teacher only)
- **Request Body**:
  ```json
  {
    "questionText": "What is the capital of France?",
    "options": {
      "A": "London",
      "B": "Paris",
      "C": "Berlin",
      "D": "Madrid"
    },
    "correctOption": "B"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "questionText": "What is the capital of France?",
    "options": {
      "A": "London",
      "B": "Paris",
      "C": "Berlin",
      "D": "Madrid"
    },
    "correctOption": "B"
  }
  ```

#### Update Test
- **Endpoint**: `PUT /teacher/tests/:id`
- **Description**: Update a test series (Approved Teacher only)
- **Request Body**: Same as create test series
- **Response**: Updated test series object

#### Get Analytics
- **Endpoint**: `GET /teacher/analytics`
- **Description**: Get teacher analytics (Approved Teacher only)
- **Response**:
  ```json
  {
    "totalTests": 5,
    "totalQuestions": 50,
    "studentPerformance": [...]
  }
  ```

### Test Attempts

#### Start Test Attempt
- **Endpoint**: `POST /attempts/start/:testId`
- **Description**: Start a test attempt
- **Response**:
  ```json
  {
    "attemptId": 1,
    "testSeries": {...},
    "questions": [...],
    "startedAt": "2023-01-01T00:00:00.000Z"
  }
  ```

#### Submit Test Attempt
- **Endpoint**: `POST /attempts/submit/:attemptId`
- **Description**: Submit a test attempt
- **Request Body**:
  ```json
  {
    "answers": [
      {
        "questionId": 1,
        "selectedOption": "B"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "score": 8,
    "totalQuestions": 10,
    "percentage": 80,
    "passed": true
  }
  ```

### Subscriptions

#### Create Subscription
- **Endpoint**: `POST /subscriptions/`
- **Description**: Create a subscription
- **Request Body**:
  ```json
  {
    "plan": "Premium",
    "expiresAt": "2023-12-31T00:00:00.000Z"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "plan": "Premium",
    "expiresAt": "2023-12-31T00:00:00.000Z",
    "status": "active"
  }
  ```

#### Get User Subscriptions
- **Endpoint**: `GET /subscriptions/`
- **Description**: Get user's subscriptions
- **Response**:
  ```json
  [
    {
      "id": 1,
      "plan": "Premium",
      "expiresAt": "2023-12-31T00:00:00.000Z",
      "status": "active"
    }
  ]
  ```

#### Check Subscription
- **Endpoint**: `GET /subscriptions/check`
- **Description**: Check if user has active subscription
- **Response**:
  ```json
  {
    "hasActiveSubscription": true,
    "plan": "Premium",
    "expiresAt": "2023-12-31T00:00:00.000Z"
  }
  ```

#### Cancel Subscription
- **Endpoint**: `PUT /subscriptions/:id/cancel`
- **Description**: Cancel a subscription
- **Response**:
  ```json
  {
    "message": "Subscription cancelled"
  }
  ```

#### Create Payment Order
- **Endpoint**: `POST /subscriptions/payment/order`
- **Description**: Create payment order for subscription
- **Request Body**:
  ```json
  {
    "plan": "Premium",
    "amount": 1000
  }
  ```
- **Response**:
  ```json
  {
    "orderId": "order_123",
    "amount": 1000,
    "currency": "INR"
  }
  ```

#### Verify Payment
- **Endpoint**: `POST /subscriptions/payment/verify`
- **Description**: Verify payment
- **Request Body**:
  ```json
  {
    "orderId": "order_123",
    "paymentId": "pay_123",
    "signature": "signature_hash"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Payment verified successfully"
  }
  ```

## Testing

Run tests with:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
