# TPC Chatbot Frontend

A modern, responsive React-TypeScript application for the Training & Placement Cell (TPC) Query Assistant system.

## 🚀 Features

- **Secure Authentication**: JWT-based login system with protected routes
- **Real-time Chat Interface**: Clean, modern chat UI with message history
- **Quick Actions**: Pre-defined query shortcuts for common questions
- **Policy Sidebar**: Quick reference to placement policies and guidelines
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (Express.js TypeScript server)

## 🛠️ Installation

### Step 1: Create the project

```bash
# Create Vite React TypeScript project
npm create vite@latest tpc-chatbot -- --template react-ts
cd tpc-chatbot
```

### Step 2: Install dependencies

```bash
# Install core dependencies
npm install

# Install additional packages
npm install axios react-router-dom date-fns lucide-react

# Install dev dependencies
npm install -D @types/react-router-dom

# Install and configure Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 3: Configure environment variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Step 4: Update configuration files

Copy the contents from the artifacts for:
- `tailwind.config.js`
- `vite.config.ts`
- `package.json`

## 📁 Project Structure

```
tpc-chatbot/
├── public/
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── QuickActions.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── LoadingSpinner.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   └── ChatPage.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── .env.example
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🎨 Key Components

### Authentication
- **AuthContext**: Manages user authentication state and JWT tokens
- **Protected Routes**: Prevents unauthorized access to chat interface
- **Login Page**: Clean, modern login interface

### Chat Interface
- **ChatMessage**: Displays user and AI messages with timestamps
- **ChatInput**: Multi-line text input with keyboard shortcuts
- **QuickActions**: Pre-defined query buttons
- **Header**: Navigation with user info and logout
- **Sidebar**: Policy reference panel (toggleable on mobile)

### API Service
- Centralized API client with Axios
- Automatic JWT token injection
- Error handling and token validation
- Request/response interceptors

## 🚦 Running the Application

### Development mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production build

```bash
npm run build
npm run preview
```

## 🔌 Backend API Integration

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - User login
  - Body: `{ registrationNo: string, password: string }`
  - Response: `{ token: string, user: User }`
- `POST /api/auth/logout` - User logout
- `GET /api/auth/validate` - Validate JWT token

### Chat
- `POST /api/chat/message` - Send chat message
  - Body: `{ message: string }`
  - Response: `{ message: string, requiresHumanIntervention?: boolean }`

### Optional
- `GET /api/policies` - Get placement policies

## 🎯 Usage

1. **Login**: Enter your registration number and password
2. **Quick Actions**: Click suggested questions or type your own
3. **Chat**: Ask questions about placement policies, eligibility, registration
4. **Sidebar**: View placement policies (click menu on mobile)
5. **Logout**: Click logout button in header

## 📱 Responsive Design

- **Desktop**: Full sidebar visible, spacious layout
- **Tablet**: Collapsible sidebar, optimized spacing
- **Mobile**: Hamburger menu, mobile-optimized chat interface

## 🔒 Security Features

- JWT token-based authentication
- Automatic token refresh handling
- Protected routes with auth checks
- Secure token storage in localStorage
- Automatic redirect on token expiration

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### API Base URL
Update `.env` file:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 🐛 Troubleshooting

### CORS Issues
Ensure your backend has CORS enabled for the frontend origin:

```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### API Connection Errors
1. Verify backend is running
2. Check API_BASE_URL in `.env`
3. Ensure endpoints match backend routes

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Dependencies

### Core
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **React Router DOM**: Routing
- **Axios**: HTTP client

### UI
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **date-fns**: Date formatting

## 🚀 Deployment

### Build for production

```bash
npm run build
```

The `dist` folder contains the production-ready files.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📄 License

This project is part of the TPC system for Lovely Professional University.

## 👥 Support

For issues or questions:
- Contact: TPC Coordinator
- Response time: ~24 hours

---

Built with ❤️ for  Lovely Professional University, Training & Placement Cell.
Transforming Education, Transforming India
