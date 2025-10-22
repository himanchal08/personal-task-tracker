# Personal Task Tracker - Full Stack Application

A modern, full-stack task management application with secure user authentication, built using React, Redux, Node.js, Express, TypeScript, Prisma ORM, and SQLite. Features JWT-based authentication, comprehensive form validation, and complete CRUD operations for tasks.

## 🚀 Features

### Authentication

- ✅ User registration with username and password
- ✅ Secure JWT-based authentication
- ✅ Token-based session management
- ✅ Protected API routes
- ✅ Logout functionality

### Task Management

- ✅ Create, read, update, and delete tasks
- ✅ Task properties: title, description, status (pending/completed)
- ✅ User-specific tasks (users only see their own tasks)
- ✅ Task filtering (All, Pending, Completed)
- ✅ Search functionality (by title, description, tags)
- ✅ Task priority levels and due dates
- ✅ Task categories/tags
- ✅ Inline editing of tasks
- ✅ Delete confirmation

### UI/UX

- ✅ Responsive design (mobile & desktop)
- ✅ Light/Dark mode toggle
- ✅ Custom color themes
- ✅ Smooth animations and transitions
- ✅ Modern, clean interface with TailwindCSS

### Technical Features

- ✅ Form validation with Zod + React Hook Form
- ✅ State management with Redux Toolkit
- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Backend validation and sanitization
- ✅ Unit and integration tests (Frontend & Backend)

## 📁 Project Structure

```
personal-task-tracker/
├── Backend/                    # Backend API
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts          # Prisma client configuration
│   │   ├── controller/
│   │   │   ├── authController.ts
│   │   │   └── taskController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts        # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── taskRoutes.ts
│   │   └── index.ts           # Express app setup
│   ├── __tests__/             # Backend tests
│   │   ├── auth.test.ts
│   │   ├── tasks.test.ts
│   │   └── middleware.test.ts
│   ├── .env                   # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── src/                       # Frontend React app
│   ├── components/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── TaskForm.js
│   │   ├── TaskItem.js
│   │   ├── TaskList.js
│   │   ├── TaskFilter.js
│   │   └── Settings.js
│   ├── store/                 # Redux store
│   │   ├── authSlice.js
│   │   ├── taskSlice.js
│   │   └── store.js
│   ├── services/
│   │   └── api.js             # Axios API service
│   ├── utils/
│   │   ├── localStorage.js
│   │   └── validationSchemas.js  # Zod schemas
│   ├── styles/
│   │   └── App.css
│   ├── __tests__/             # Frontend tests
│   │   ├── Login.test.js
│   │   └── TaskItem.test.js
│   ├── App.js
│   ├── index.js
│   └── setupTests.js
├── public/
├── .env                       # Frontend environment variables
├── package.json
├── tailwind.config.js
└── README.md
```

## 🛠️ Technology Stack

### Frontend

- **React** 18.2.0 (with Webpack via react-scripts)
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React Hook Form** + **Zod** - Form validation
- **TailwindCSS** - Styling
- **React Icons** - Icon library
- **Jest** + **React Testing Library** - Testing

### Backend

- **Node.js** + **Express** - Server framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database ORM
- **SQLite** - Database (easily switchable to PostgreSQL/MySQL/MongoDB)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Jest** + **Supertest** - Testing

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/himanchal08/personal-task-tracker.git
cd personal-task-tracker
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
NODE_ENV=development

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
REACT_APP_API_URL=http://localhost:5000/api

# Start frontend development server
npm start
```

Frontend will run on `http://localhost:3000`

## 🧪 Running Tests

### Backend Tests

```bash
cd Backend
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
```

Test coverage includes:

- Authentication (register, login, validation)
- Task CRUD operations
- JWT middleware
- Authorization checks
- Error handling

### Frontend Tests

```bash
npm test                    # Run all tests
npm test -- --coverage     # Run with coverage report
```

Test coverage includes:

- Component rendering
- Form validation
- User interactions

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string" (min: 3, max: 50),
  "password": "string" (min: 6, max: 100)
}

Response: 201 Created
{
  "user": {
    "id": number,
    "username": "string"
  },
  "message": "User registered successfully"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response: 200 OK
{
  "token": "jwt-token-string",
  "message": "Login successful"
}
```

### Task Endpoints (Requires JWT Token)

All task endpoints require `Authorization: Bearer <token>` header.

#### Get All Tasks

```http
GET /api/tasks
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": number,
    "title": "string",
    "description": "string | null",
    "status": "pending" | "completed",
    "userId": number,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }
]
```

#### Create Task

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string" (required, max: 200),
  "description": "string" (optional, max: 1000),
  "status": "pending" | "completed" (optional, default: "pending")
}

Response: 201 Created
{
  "task": { ... },
  "message": "Task created successfully"
}
```

#### Update Task

```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string" (optional, max: 200),
  "description": "string" (optional, max: 1000),
  "status": "pending" | "completed" (optional)
}

Response: 200 OK
{
  "task": { ... },
  "message": "Task updated successfully"
}
```

#### Delete Task

```http
DELETE /api/tasks/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Task deleted successfully"
}
```

### Error Responses

```http
400 Bad Request - Validation error
{
  "message": "Error description"
}

401 Unauthorized - Missing or invalid token
{
  "message": "Authorization header missing" | "Token missing"
}

403 Forbidden - Expired token or insufficient permissions
{
  "message": "Invalid or expired token" | "Not authorized to ..."
}

404 Not Found - Resource not found
{
  "message": "Task not found" | "User not found"
}

500 Internal Server Error - Server error
{
  "message": "Server error",
  "error": "Error details"
}
```

## 🌐 Live Demo

[Live Demo Link](https://personal-task-tracker-azure.vercel.app/)

## 🔒 Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT tokens with 24-hour expiration
- Protected API routes with middleware
- User authorization checks (users can only access their own tasks)
- Input validation and sanitization on both frontend and backend
- CORS enabled for cross-origin requests
- HTTP-only cookies support (configurable)

## 🎨 Development Features

- **Hot Reload**: Both frontend and backend support hot reloading during development
- **TypeScript**: Backend uses TypeScript for type safety
- **ESLint**: Code linting for consistent code style
- **Prettier**: Code formatting (configurable)
- **Git Hooks**: Pre-commit hooks for code quality (optional)

## 📝 Environment Variables

### Backend (.env in Backend directory)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
NODE_ENV=development
```

### Frontend (.env in root directory)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🗄️ Database

The application uses SQLite by default for easy setup and portability. To switch to PostgreSQL, MySQL, or MongoDB:

1. Update `Backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // or "mysql", "mongodb"
  url      = env("DATABASE_URL")
}
```

2. Update `DATABASE_URL` in Backend/.env:

```env
# PostgreSQL example
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager"

# MySQL example
DATABASE_URL="mysql://user:password@localhost:3306/taskmanager"

# MongoDB example
DATABASE_URL="mongodb://localhost:27017/taskmanager"
```

3. Run migrations:

```bash
cd Backend
npx prisma migrate dev
```

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, Render)

1. Set environment variables on your platform
2. Ensure DATABASE_URL points to production database
3. Run build: `npm run build`
4. Start: `npm start`

### Frontend Deployment (Vercel, Netlify, GitHub Pages)

1. Set REACT_APP_API_URL to your backend URL
2. Build: `npm run build`
3. Deploy `build/` directory

## 🧪 Test Coverage

The application includes comprehensive tests:

### Backend Test Coverage

- ✅ User registration (success, validation, duplicates)
- ✅ User login (success, invalid credentials)
- ✅ Task CRUD operations
- ✅ JWT middleware (valid, invalid, expired tokens)
- ✅ Authorization (user-specific data access)
- ✅ Input validation and error handling

### Frontend Test Coverage

- ✅ Login component rendering and validation
- ✅ Task component rendering and interactions
- ✅ Form validation with Zod schemas
- ✅ User interactions (click, change, submit)

## 📊 Performance Optimizations

- Lazy loading of components
- Memoization of expensive calculations
- Debounced search functionality
- Optimized re-renders with React.memo
- Redux state management for efficient updates
- Database indexing on frequently queried fields

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Himanchal Khattri**

- GitHub: [@himanchal08](https://github.com/himanchal08)
- Email: himanchalkhattri@gmail.com
