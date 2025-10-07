# Click2Hire 🚀

> A modern, secure, and scalable remote job platform built with the MERN stack

[![Developer](https://img.shields.io/badge/Developer-Yogesh%20Pote-blue)](https://yogeshpote.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

## 🌟 Overview

Click2Hire is a comprehensive remote job platform designed to bridge the gap between job seekers and employers in the digital economy. Unlike traditional job platforms that require premium access for full features, Click2Hire focuses on simplicity, accessibility, and is specifically tailored for remote work opportunities.

### Why Click2Hire?

- **Simple & Focused**: Clean, minimal design dedicated solely to remote hiring
- **Accessible**: Fully web-based with responsive design for all devices
- **Secure**: JWT-based authentication with role-based access control
- **Scalable**: Built on modern MERN stack architecture
- **Open**: Modular design allowing easy feature extensions

## ✨ Features

### For Job Seekers
- 🔍 Advanced job search and filtering
- 📄 Resume upload and management
- 📊 Application tracking dashboard
- 👤 Profile management
- 🔔 Real-time application status updates

### For Employers
- 📝 Post and manage job listings
- 👥 View and manage applications
- 📈 Track hiring metrics
- ✏️ Update job postings in real-time
- 🗑️ Delete outdated listings

### For Admins
- 🛡️ User management and moderation
- 📊 Platform oversight and analytics
- 🔒 Content moderation tools
- 📈 System monitoring

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Multer** - File upload handling

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - ODM (Object Data Modeling)

### Authentication & Security
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- 4GB+ RAM

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/click2hire.git
   cd click2hire
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

5. **Start the development servers**
   
   Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend:
   ```bash
   cd frontend
   npm start
   ```

6. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
click2hire/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
└── README.md
```

## 🧩 Modules

### 1. Authentication Module
Handles secure user registration and login with role-based access control for Job Seekers, Employers, and Admins.

### 2. Job Management Module
Enables employers to create, update, and delete job postings with detailed information.

### 3. Job Search & Apply Module
Provides job seekers with advanced filtering options and streamlined application process.

### 4. Resume Upload Module
Allows job seekers to upload and attach resumes to their applications.

### 5. Admin Module
Comprehensive dashboard for platform administration, user management, and content moderation.

### 6. Profile Management Module
Users can update their profiles and view application/posting history.

## 🎥 Demo

![Click2Hire Demo](./Frontend/public/demo.gif)

[📹 Download Full Demo Video](./Frontend/public/demo.gif)

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - Register new user
POST /api/auth/login - User login
GET /api/auth/profile - Get user profile
```

### Job Endpoints
```
GET /api/jobs - Get all jobs
POST /api/jobs - Create job (Employer only)
PUT /api/jobs/:id - Update job (Employer only)
DELETE /api/jobs/:id - Delete job (Employer only)
```

### Application Endpoints
```
POST /api/applications - Submit application
GET /api/applications/user - Get user applications
GET /api/applications/job/:id - Get job applications
```

For detailed API documentation, test endpoints using [Postman](https://www.postman.com/).

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔮 Future Enhancements

- [ ] Real-time chat system between employers and candidates
- [ ] AI-powered job recommendations
- [ ] Integrated resume builder
- [ ] Interview scheduling system
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile application (React Native)
- [ ] Video interview integration

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Yogesh Dattatray Pote**
- Portfolio: [yogeshpote.vercel.app](https://yogeshpote.vercel.app/)
- Roll No: 253331068
- Department: TY.B.Sc.CS

## 🙏 Acknowledgments

- MongoDB, React.js, Express.js, and Node.js documentation
- JavaScript Mastery and Codevolution YouTube channels
- TutorialsPoint and GeeksforGeeks
- ChatGPT for UI improvements and debugging assistance

---

<div align="center">
  Made with ❤️ by Yogesh Pote
  
  ⭐ Star this repository if you find it helpful!
</div>
