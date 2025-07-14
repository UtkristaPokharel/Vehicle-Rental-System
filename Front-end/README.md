# Vehicle Management System

A full-stack vehicle management system with authentication and image upload functionality.

## Features

- **Authentication**: JWT-based user authentication
- **File Upload**: Local image upload using Multer
- **Vehicle Management**: Add, view, update, and delete vehicles
- **User-specific Data**: Users can only modify vehicles they added
- **Image Handling**: Automatic image cleanup on errors
- **Unique IDs**: UUID-based vehicle identification
- **User Tracking**: Track who added each vehicle

## Backend Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Create a new directory for your backend:
```bash
mkdir vehicle-backend
cd vehicle-backend
```

2. Initialize the project and install dependencies:
```bash
npm init -y
npm install express cors multer jsonwebtoken bcrypt uuid
npm install --save-dev nodemon
```

3. Create the server file (`server.js`) with the provided backend code.

4. Update your `package.json` scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

5. Create an `uploads` directory (will be created automatically):
```bash
mkdir uploads
```

### Environment Variables (Optional)
Create a `.env` file for production:
```
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3001
```

### Running the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3001`

## Frontend Setup

### Prerequisites
- React.js application
- Axios or fetch for API calls

### Installation

1. In your React project, install any additional dependencies if needed:
```bash
npm install
```

2. Replace your existing component with the updated `AddVehicle` component.

3. Add the `Login` component to handle authentication.

4. Update your routing to include both components.

## API Endpoints

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user
- `GET /auth/verify` - Verify JWT token

### Vehicle Management
- `POST /admin/add-vehicle` - Add new vehicle (requires auth + image)
- `GET /vehicles` - Get all vehicles
- `GET /vehicles/:id` - Get vehicle by ID
- `PUT /admin/vehicles/:id` - Update vehicle (requires auth)
- `DELETE /admin/vehicles/:id` - Delete vehicle (requires auth)
- `GET /admin/my-vehicles` - Get user's vehicles (requires auth)

### Static Files
- `GET /uploads/:filename` - Serve uploaded images

## Usage

### Default Admin Account
- Username: `admin`
- Password: `admin123`

### Adding a Vehicle
1. Login with valid credentials
2. Fill in all required fields
3. Upload an image (JPEG, PNG, JPG - max 5MB)
4. Add features by category
5. Submit the form

### Image Upload Rules
- Supported formats: JPEG, PNG, JPG
- Maximum size: 5MB
- Images are automatically renamed with timestamp + UUID
- Images are deleted if vehicle creation fails

## File Structure

```
vehicle-backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── uploads/           # Uploaded images directory
└── README.md         # This file

vehicle-frontend/
├── src/
│   ├── components/
│   │   ├── AddVehicle.js    # Vehicle form component
│   │   └── Login.js         # Authentication component
│   └── ...
└── ...
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- File type validation
- File size limits
- User-specific data access
- Automatic cleanup of failed uploads

## Database

Currently uses in-memory storage for demonstration. For production:

1. Replace arrays with database models (MongoDB, PostgreSQL, etc.)
2. Add proper error handling and validation
3. Implement database migrations
4. Add proper logging

## Error Handling

The system includes comprehensive error handling:
- File upload errors
- Authentication failures
- Validation errors
- Database connection issues
- Image cleanup on failures

## CORS Configuration

The server is configured to accept requests from any origin. For production:
```javascript
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

## Production Considerations

1. **Environment Variables**: Use proper environment variables for secrets
2. **Database**: Replace in-memory storage with a proper database
3. **File Storage**: Consider cloud storage (AWS S3, Cloudinary)
4. **Security**: Add rate limiting, input sanitization
5. **Logging**: Implement proper logging system
6. **Testing**: Add unit and integration tests
7. **Deployment**: Use process managers like PM2

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure backend is running on port 3001
2. **File Upload Fails**: Check file size and format
3. **Authentication Errors**: Verify JWT token is being sent
4. **Image Not Loading**: Check uploads directory permissions

### Debug Mode
Enable debug logging by adding to server.js:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

## License

MIT License - feel free to use and modify as needed.