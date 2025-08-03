**Project Report: Remote Job Platform**

---

**1. Title:** Click2Hire Remote Job Platform

**2. Team Members:**

- Name : Yogesh Dattatray Pote

**3. Guide Name:** Yogesh D Pote

**4. Introduction:**
In the digital economy, remote jobs have become increasingly popular. However, many job seekers face difficulties in accessing verified opportunities, and employers often struggle with remote hiring workflows. This project aims to bridge that gap by developing a secure, scalable, and user-friendly Remote Job Platform using the MERN stack (MongoDB, Express.js, React.js, Node.js). The platform connects job seekers and employers efficiently while providing administrative oversight.

**5. Objectives:**

- To develop a secure job platform with role-based access for Job Seekers, Employers, and Admin.
- To allow Employers to post and manage job listings.
- To allow Job Seekers to apply for jobs and track applications.
- To provide Admin functionality to oversee platform usage.
- To create a responsive and user-friendly frontend.

**6. Existing System:**
Currently, platforms like LinkedIn and Naukri serve similar purposes. However, they often require premium access for full features and are not specifically tailored for remote work. They also lack simplicity for small organizations and startups.

**7. Proposed System:**
Our proposed system focuses on:

- Simplicity: Clean, minimal design focused only on remote hiring.
- Accessibility: Fully web-based, responsive design.
- Customizability: Open to modular feature extension.
- Security: Authentication using JWT and role-based access.

**8. System Requirements:**
**Software:**

- VS Code
- Node.js & npm
- MongoDB
- Postman (for API testing)

**Hardware:**

- Any computer with 4GB+ RAM
- Internet connectivity

**9. Technology Stack:**

- **Frontend:** React.js, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT and bcrypt
- **File Uploads:** Multer

**10. Modules:**

- **Authentication Module:** Secure login/signup for Job Seekers, Employers, and Admin
- **Job Management Module:** Post, update, and delete job listings (Employer role)
- **Job Search & Apply Module:** Job filtering and application tracking (Job Seeker role)
- **Resume Upload Module:** Upload and attach resumes to applications
- **Admin Module:** Manage users, jobs, and handle content moderation
- **Profile Management Module:** Update profile info, view application history

**11. ER Diagram (Simplified):**

- Users (Job Seekers, Employers, Admin)
- Jobs (posted by Employers)
- Applications (by Job Seekers to Jobs)

**12. Data Flow Diagram (DFD - Level 1):**

- User inputs -> Authentication -> Role access granted
- Job Seeker -> Searches jobs -> Applies -> Application stored
- Employer -> Posts job -> Job saved
- Admin -> Monitors system activities

**13. Screenshots (To be added after implementation):**

- Homepage
- Login/Signup Page
- Job Listing Page
- Employer Dashboard
- Admin Panel

**14. Testing:**

- Unit Testing: Done for API endpoints using Postman.
- Integration Testing: Checked interaction between frontend & backend.
- UI Testing: Ensured responsiveness across devices.

**15. Future Scope:**

- Chat system between employer and candidate
- AI-based job recommendations
- Resume builder
- Interview scheduling system

**16. Conclusion:**
This project delivers a complete remote job platform aimed at simplifying job discovery and recruitment processes in a remote-first environment. The MERN stack allows for rapid development and scalability. It can serve as a base for future commercial or community platforms.

**17. References:**

- MongoDB Documentation
- React.js Documentation
- Express.js & Node.js Docs
- TutorialsPoint, GeeksforGeeks
- YouTube: JavaScript Mastery, Codevolution

---

# End of Report
