# Livestock Logistics App

A real-time livestock logistics tracking web application featuring role-based dashboards for senders, transporters, and admins. Built with React, Vite, Node.js, Express, and Socket.IO.

## Features

- **Real-time shipment tracking** with WebSockets (Socket.IO).
- **Role-based dashboards**:
  - **Sender**: Create and track shipments on an interactive map.
  - **Transporter**: Browse available shipments, accept jobs, and view accepted shipments.
  - **Admin**: Monitor users, shipments, and live tracking data centrally.
- **User authentication** and authorization using JWT.
- **File uploads** for avatars and shipment documentation.
- **RESTful API** for shipment and user management.
- **Responsive UI** built with Tailwind CSS.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, ESLint, PostCSS
- **Backend**: Node.js, Express, Socket.IO, Mongoose (MongoDB), JWT, dotenv, CORS
- **Database**: MongoDB

## Prerequisites

- **Node.js** v16+ and npm/yarn
- **MongoDB** (local installation or Atlas cluster)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sachidanand-minj/livestock-logistics-app.git
   cd livestock-logistics-app
   ```

2. **Backend setup**
   ```bash
   cd livestock-logistics-backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend setup**
   ```bash
   cd ../livestock-logistics-frontend
   npm install
   cp .env.example .env.local
   # Update .env.local to point to your backend API and Socket server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend:  https://livestocklogistics.animbiz.com/

## Environment Variables

### Backend (`livestock-logistics-backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/livestock
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### Frontend (`livestock-logistics-frontend/.env.local`)
```env
VITE_API_URL=https://livestocklogistics.animbiz.com//api
VITE_SOCKET_URL=https://livestocklogistics.animbiz.com/
```

## Project Structure

```
livestock-logistics-backend/
├── controllers/       # Route handlers
├── middlewares/       # Auth, validation, error handling
├── models/            # Mongoose schemas
├── routes/            # Express routers
├── sockets/           # Socket.IO event handlers
├── utils/             # Helper functions
├── uploads/avatars/   # Uploaded files
├── server.js          # App entry point
└── .env.example       # Sample environment variables

livestock-logistics-frontend/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page-level components
│   ├── styles/        # Tailwind overrides
│   └── main.jsx       # React entry point
├── index.html         # HTML template
├── package.json       # Frontend dependencies & scripts
├── tailwind.config.js # Tailwind setup
├── postcss.config.js  # PostCSS setup
└── vite.config.js     # Vite configuration
```

## API Endpoints

| Method | Endpoint                     | Description                        |
|--------|------------------------------|------------------------------------|
| POST   | `/api/auth/register`         | Register a new user                |
| POST   | `/api/auth/login`            | Authenticate and obtain a JWT      |
| POST   | `/api/shipments`             | Create a new shipment              |
| GET    | `/api/shipments`             | List all shipments (filtered view) |
| GET    | `/api/shipments/:id`         | Shipment details                   |
| PUT    | `/api/shipments/:id/accept`  | Transporter accepts a shipment     |
| PUT    | `/api/shipments/:id/status`  | Update shipment status             |

## WebSocket Events

- **connection**: New client connection established.
- **track-shipment**: Emit live location updates to subscribed clients.
- **disconnect**: Client disconnect event.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or suggestions, reach out to Sachidanand Minj at [your-email@example.com].

