Project Title: Cards Project Full

## Overview
This full-stack web application allows registered users to manage business cards. It includes two main parts:

- **Frontend**: Built with React.
- **Backend**: Built with Node.js, Express.js, and MongoDB.

Users can register, log in, create and edit business cards, and manage their personal or business-related information. Admin users have access to additional permissions and data.

## Main Features

### Frontend
- Responsive UI with Light/Dark mode.
- Login and registration with form validation (regex).
- Token-based user authentication (JWT stored in `localStorage`).
- Business card creation, editing, and deletion (CRUD).
- View other users’ cards, including like and favorite functionality.
- Protected routes based on user roles (user, business, admin).
- Admin dashboard with user management.
- Client-side routing with React Router.
- Dynamic Google Maps integration for location display.
- Footer, about page, and error handling pages included.

### Backend
- REST API with full CRUD functionality.
- MongoDB + Mongoose models: Users and Cards.
- Authentication using bcryptjs and JWT.
- Input validation using Joi.
- Logger using Morgan and optional file logging.
- Initial seed data: regular user, business user, and admin.
- Environment-based configuration via dotenv.
- CORS configuration for API access control.
- Rate-limiting for failed login attempts.

## Installation

1. Clone the repository.
2. Navigate to `/client` and `/server` folders separately.
3. Run `npm install` in both directories.
4. Create `.env` file in `/server` with your environment variables:
