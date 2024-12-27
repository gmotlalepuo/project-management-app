<div align="center">
  <img src="public/logo.svg" alt="TeamSync Logo" width="80">
  
  # TeamSync
</div>

<p align="center">A modern project management application built with Laravel and React, designed to help teams collaborate efficiently through intuitive task management and real-time communication.</p>

## ✨ Features

### 📊 Project Management

- Create and manage multiple projects
- Track project progress and completion status
- Invite team members with role-based permissions (Project Manager, Project Member)
- Real-time project statistics and analytics
- Project status tracking (Pending, In Progress, Completed)

### ✅ Task Management

- Create, assign, and track tasks within projects
- Task categorization with customizable labels
- Task prioritization (Low, Medium, High)
- Task status tracking (Pending, In Progress, Completed)
- Task discussions with threaded comments
- Task filtering and sorting capabilities

### 👥 Team Collaboration

- Role-based access control
- Project member invitation system
- Real-time notifications for project updates
- Task assignment and reassignment
- Team member management
- Collaborative task discussions

### 🎨 User Interface

- Modern, responsive design
- Dark/Light theme support
- Intuitive navigation
- Real-time updates
- Dashboard with project and task overview
- Filtering and sorting capabilities

### 🔐 Authentication

- Traditional email/password authentication
- Social login support:
  - GitHub authentication
  - Google authentication
- Password reset functionality
- Email verification

## 🛠️ Tech Stack

### 🔧 Backend

- PHP 8.x
- Laravel 11.x
- MySQL
- Laravel Sanctum for authentication
- Spatie Permissions for role management
- Real-time notifications with Laravel Reverb

### 🎯 Frontend

- React with TypeScript
- Inertia.js for SPA-like experience
- TailwindCSS for styling
- Shadcn UI components
- Lucide icons
- Real-time updates with WebSockets

## 📥 Installation

1. Clone the repository

```bash
git clone https://github.com/stekatag/project-management-app.git
cd project-management-app
```

2. Install PHP dependencies

```bash
composer install
```

3. Install JavaScript dependencies

```bash
pnpm install # or npm install if you don't have pnpm installed
```

4. Configure environment variables

```bash
cp .env.example .env
```

Update the following in your .env file:

- Database credentials
- App URL
- Mail configuration
- Reverb/WebSocket settings
- OAuth Socialite settings (optional)

### Social Login Configuration

Add these to your .env file for social authentication:

```bash
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI="${OAUTH_BASE_URL}/auth/github/callback"

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI="${OAUTH_BASE_URL}/auth/google/callback"
```

5. Generate application key

```bash
php artisan key:generate
```

6. Run migrations and seeders

```bash
php artisan migrate --seed
```

## 👤 Default Credentials

After seeding the database, you can login with:

- Email: admin@example.com
- Password: password1

## 💻 Development

For local development:

1. Start the Laravel development server

```bash
php artisan serve
```

2. Run Vite development server

```bash
pnpm dev # or npm run dev if you don't have pnpm installed
```

3. Run WebSocket server (for real-time features)

```bash
php artisan reverb:start
```

4. Run the Laravel queue worker

```bash
php artisan queue:listen
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
