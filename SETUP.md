# Dev Overflow NextJS Setup Instructions

This is a Stack Overflow clone built with Next.js 14, featuring authentication with Clerk, MongoDB database, and TinyMCE rich text editor.

## ✅ Successfully Fixed Issues

1. **Missing Environment Variables**: Created `.env.local` with required environment variables
2. **Suspense Boundary Error**: Fixed `useSearchParams()` issue by wrapping GlobalSearch in a Suspense boundary

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud)
- Clerk account for authentication
- TinyMCE account for rich text editor (optional)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
The project includes a `.env.local` file with placeholder values. You need to replace them with actual values:

```env
# MongoDB Connection String
MONGODB_URL=mongodb://localhost:27017/devoverflow  # Replace with your MongoDB URL

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk Webhook Secret (optional for development)
NEXT_CLERK_WEBHOOK_SECRET=your_webhook_secret

# TinyMCE API Key (optional)
NEXT_PUBLIC_TINY_EDITOR_API_KEY=your_tinymce_api_key
```

### 3. Get Required API Keys

#### Clerk Setup:
1. Sign up at [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy the Publishable Key and Secret Key
4. Replace the placeholder values in `.env.local`

#### MongoDB Setup:
- **Local MongoDB**: Use `mongodb://localhost:27017/devoverflow`
- **MongoDB Atlas**: Get connection string from your Atlas cluster

#### TinyMCE Setup (Optional):
1. Sign up at [TinyMCE](https://www.tiny.cloud/)
2. Get your API key from the dashboard
3. Add it to `.env.local`

### 4. Build and Run

#### Development Mode:
```bash
npm run dev
```

#### Production Build:
```bash
npm run build
npm start
```

#### Lint:
```bash
npm run lint
```

## 🛠 Fixed Build Errors

### 1. Environment Variables Error
**Issue**: Missing `MONGODB_URL` and Clerk keys causing build failures.
**Fix**: Created `.env.local` with all required environment variables.

### 2. Suspense Boundary Error  
**Issue**: `useSearchParams() should be wrapped in a suspense boundary` error on the `/ask-question` page.
**Fix**: Created `GlobalSearchWrapper` component that wraps `GlobalSearch` with a Suspense boundary.

## 📁 Project Structure

```
dev_overflow_nextjs14/
├── app/                    # Next.js app router
├── components/            # React components
├── lib/                   # Utility functions and database
├── styles/                # CSS and styling
├── public/                # Static assets
├── .env.local            # Environment variables
└── package.json          # Dependencies
```

## 🎯 Features

- **Authentication**: Clerk-based user authentication
- **Database**: MongoDB with Mongoose ODM
- **Rich Text Editor**: TinyMCE for question/answer formatting
- **Search**: Global search functionality
- **Responsive Design**: Tailwind CSS with dark/light mode
- **TypeScript**: Full TypeScript support

## 🐛 Common Issues

1. **MongoDB Connection**: Ensure your MongoDB server is running or your Atlas cluster is accessible
2. **Clerk Authentication**: Make sure your Clerk keys are correctly set in `.env.local`
3. **Port Conflicts**: The default port is 3000, change if needed

## 📝 Notes

- The build process will show Tailwind CSS warnings - these are style optimization suggestions and don't affect functionality
- MongoDB connection logs will appear during build process - this is normal
- Some components use custom Tailwind classes defined in the theme configuration

## 🔧 Development Tips

- Use `npm run dev` for development with hot reload
- Use `npm run build` to test production builds locally  
- Use `npm run lint` to check code style and potential issues
- Check console for MongoDB connection status during startup

## 🚀 Deployment

The project is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service. Make sure to:

1. Set all environment variables in your deployment platform
2. Ensure your MongoDB database is accessible from the deployment environment
3. Configure Clerk with the correct domains for your deployed app
