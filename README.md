<div align="center">
  <img src="https://img.icons8.com/color/96/000000/link.png" alt="LinkHub Logo" />
  <h1>LinkHub</h1>
  <p><strong>A Modern, AI-Powered Bookmark & Link Management System</strong></p>
  
  <p>
    <a href="https://github.com/YOUR-USERNAME/linkhub/commits/main">
      <img src="https://img.shields.io/github/last-commit/YOUR-USERNAME/linkhub.svg?style=flat-square&color=blue" alt="Last Commit" />
    </a>
    <a href="https://github.com/YOUR-USERNAME/linkhub/issues">
      <img src="https://img.shields.io/github/issues/YOUR-USERNAME/linkhub.svg?style=flat-square&color=orange" alt="Issues" />
    </a>
    <a href="https://github.com/YOUR-USERNAME/linkhub/stargazers">
      <img src="https://img.shields.io/github/stars/YOUR-USERNAME/linkhub.svg?style=flat-square&color=yellow" alt="Stars" />
    </a>
  </p>
</div>

---

## 🌟 Overview

**LinkHub** is a full-stack, enterprise-grade web application designed to help users intelligently store, organize, and share their bookmarks. Built with a stunning modern UI and powered by Gemini AI, LinkHub automatically fetches link metadata, categorizes content, and provides smart AI suggestions. 

Whether you're a developer saving documentation, a student organizing research, or a creator sharing public collections, LinkHub provides a seamless and beautiful experience.

## ✨ Key Features

- 🔐 **Advanced Security & Authentication**: Secure JWT-based authentication, Email Verification, Password Reset, and **Google OAuth2** integration.
- 🤖 **Gemini AI Integration**: Automatically analyzes saved URLs to extract titles, descriptions, and generate smart categorization tags. Includes an interactive AI Chatbot for intelligent assistance.
- 📂 **Smart Organization**: Organize your links with custom Tags, Categories, and Collections.
- 🌐 **Social & Community Feed**: A dynamic "Posts" feed where users can share their collections, complete with likes, comments, and real-time interactions.
- 🌓 **Premium UI/UX**: A stunning, responsive design with glassmorphism effects, smooth micro-animations, and full Dark/Light mode support.
- 📊 **Analytics Dashboard**: Real-time insights and statistics on your saved content.
- ☁️ **Cloud Storage**: Integrated with Cloudinary for seamless image and avatar uploads.

## 🛠️ Technology Stack

### Frontend
- **React.js (Vite)**
- **Tailwind CSS v4** (with custom class-based dark mode)
- **React Router** for seamless navigation
- **Lucide React** for modern iconography
- **Axios** for API communication

### Backend
- **Java Spring Boot 3.x**
- **Spring Security** & **OAuth2 Client**
- **PostgreSQL** (Relational Database)
- **Hibernate / JPA** (ORM)
- **JWT (JSON Web Tokens)** for stateless authentication
- **JavaMailSender** for SMTP email services
- **Gemini AI API** integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 21+
- PostgreSQL
- Maven

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/linkhub.git
   cd linkhub
   ```

2. **Backend Configuration**
   - Navigate to `backend/linkhub-backend/src/main/resources/`
   - Copy `application.properties.example` to `application.properties`
   - Fill in your secure credentials (PostgreSQL, Google Client ID, Gemini API Key, etc.)
   - Run the backend:
     ```bash
     cd backend/linkhub-backend
     ./mvnw spring-boot:run
     ```

3. **Frontend Configuration**
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies and start the dev server:
     ```bash
     npm install
     npm run dev
     ```

4. **Open your browser**
   - The application will be running at `http://localhost:5173`

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/YOUR-USERNAME/linkhub/issues).

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  <i>Built with passion and coffee by <a href="https://github.com/YOUR-USERNAME">Suryaprakash</a></i>
</div>