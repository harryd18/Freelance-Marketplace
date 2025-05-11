# Freelance Marketplace Platform

A full-stack freelance job marketplace where clients can post jobs and freelancers can bid on them.Built with React (frontend), PHP (backend), and MySQL (database). Deployed on Render and Azure.

## Features

- Secure user authentication for clients and freelancers
- Role-based dashboards
- JWT-like Token Authentication with Bearer Token support
- Clients can post, edit, and delete job listings
- Freelancers can view jobs and submit bids
- Data is stored in a MySQL database hosted on Azure
- Clean and responsive UI using React and Bootstrap

## Technologies Used

- **Frontend:** React.js, Bootstrap
- **Backend:** PHP (REST API)
- **Database:** MySQL (hosted on Azure MySQL Flexible Server)
- **Hosting:** Render (Frontend & Backend), Azure (Database)
- **Authentication:** JWT (JSON Web Token) with password hashing using bcrypt

## Deployment Notes

- The backend and frontend are hosted on Render using the free tier.
- Due to the free hosting tier, initial load times may take 5–10 seconds if the service is asleep.

## Getting Started (Local Setup)

1. Clone the repository:

```bash
git clone https://github.com/yourusername/freelance-marketplace.git
cd freelance-marketplace
```

2. Create a `.env` file in the backend directory with the following details:

```
DB_HOST=your-db-host
DB_NAME=freelance_marketplace
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
```

3. Set up the database using the `freelance_marketplace` schema and required tables (users, jobs, bids).

4. Start the PHP server (for example using XAMPP or php -S):

```bash
cd backend
php -S localhost:8000
```

5. Start the React frontend:

```bash
cd client
npm install
npm start
```

6. Visit `http://localhost:3000` to use the app.

7. Security Best Practices

 - .env file is excluded using .gitignore.
 - SSL Certificate used for production MySQL connection.
 - Passwords are never stored in plain text

## Live Demo

- **Frontend:** https://freelance-marketplace-1-x5jm.onrender.com/
- **Backend API:** https://freelance-marketplace-aetf.onrender.com

## Author

Harshit Dhasmana 
Email : dharshit2001@gmail.com
**LinkedIn –** [Visit My Profile](https://www.linkedin.com/in/harshit-dhasmana-15b9342bb)
Graduate Diploma in Computer and Information Science  
Auckland University of Technology