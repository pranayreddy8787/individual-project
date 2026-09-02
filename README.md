# QuickDrop - Hyper-Local Delivery Dispatcher

A full-stack MERN application for managing hyper-local delivery services, connecting customers, stores, delivery partners, and admin dispatchers.

## 🚀 Features

### For Customers
- Browse nearby stores based on location
- Search and filter products
- Add products to cart
- Place orders from multiple stores
- Track real-time order status
- View order history
- Cancel eligible orders

### For Stores/Restaurants
- Manage store profile and settings
- Add, edit, and delete products
- View incoming orders
- Accept or reject orders
- Update order preparation status
- View order history and analytics

### For Delivery Partners
- View assigned deliveries
- Accept/reject delivery assignments
- Update delivery status in real-time
- Track pickup and delivery locations
- View delivery history and earnings

### For Admin/Dispatcher
- Dashboard with key metrics
- View all orders with advanced filtering
- Manage active deliveries
- Assign delivery partners intelligently
- Reassign deliveries when needed
- Manage users, stores, and delivery partners
- View analytics and reports

### Core Features
- **Hyper-Local Logic**: Distance-based store filtering using Haversine formula
- **Smart Delivery Assignment**: Matches delivery partners based on proximity and availability
- **Real-time Status Tracking**: Complete order lifecycle from placement to delivery
- **Role-Based Access Control**: Different interfaces for different user roles
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **JWT Authentication**: Secure user authentication and authorization

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router v6
- Axios
- Context API for state management
- Vite for bundling
- CSS3 with Responsive Design

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- CORS for cross-origin requests

### Database
- MongoDB
- Mongoose schemas with validation

## 📁 Project Structure

```
hyperlocal-delivery/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components for different routes
│   │   ├── context/        # React Context (Auth, Cart)
│   │   ├── services/       # API service and utilities
│   │   ├── styles/         # CSS stylesheets
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts (seeding)
│   ├── utils/              # Helper functions
│   ├── uploads/            # File storage directory
│   ├── server.js           # Main server file
│   ├── .env.example        # Environment variables template
│   └── package.json
│
├── README.md               # This file
├── .gitignore              # Git ignore rules
└── package.json            # Root package.json
```

## 📋 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (running locally or Atlas URI)
- Git

### Step 1: Clone/Setup the Project
```bash
cd hyperlocal-delivery
```

### Step 2: Install All Dependencies
```bash
npm run install-all
```

Or install individually:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### Step 3: Configure Environment Variables

#### Server (.env)
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/quickdrop
JWT_SECRET=your_secret_key_here_change_in_production
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**For MongoDB Atlas:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/quickdrop?retryWrites=true&w=majority
```

### Step 4: Seed Sample Data

```bash
cd server
npm run seed
```

This creates:
- 1 Admin user
- 5 Sample customers
- 5 Sample stores
- 25 Sample products
- 5 Delivery partners
- Sample orders

**Test Credentials:**
```
Admin: admin@quickdrop.com / admin123
Customer: rajesh@example.com / password123
Store: foodhaven@example.com / password123
Delivery Partner: rohan.delivery@example.com / password123
```

## 🚀 Running the Application

### Option 1: Run Both Client and Server Together
```bash
npm run dev
```

This uses concurrently to start:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Option 2: Run Separately

#### Terminal 1 - Backend
```bash
npm run server
```

#### Terminal 2 - Frontend
```bash
npm run client
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)

### Store Endpoints
- `GET /api/stores` - Get all stores (supports location filtering)
- `GET /api/stores/:id` - Get store details
- `POST /api/stores` - Create store (store role required)
- `PUT /api/stores/:id` - Update store (owner only)
- `DELETE /api/stores/:id` - Delete store (owner only)

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (store role required)
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (store or admin)
- `PUT /api/orders/:id/cancel` - Cancel order (customer only)
- `GET /api/orders/store/orders` - Get store's orders (store role)

### Delivery Endpoints
- `GET /api/delivery/available` - Get available delivery partners
- `GET /api/delivery/my-deliveries` - Get partner's assigned deliveries
- `PUT /api/delivery/:id/accept` - Accept delivery assignment
- `PUT /api/delivery/:id/reject` - Reject delivery assignment
- `PUT /api/delivery/:id/status` - Update delivery status
- `GET /api/delivery/:id` - Get delivery details

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/orders` - Get all orders with filters
- `GET /api/admin/deliveries` - Get all deliveries
- `PUT /api/admin/orders/:id/assign` - Assign delivery partner
- `PUT /api/admin/deliveries/:id/reassign` - Reassign delivery partner
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stores` - Get all stores

## 🔐 User Roles and Permissions

### Customer
- Browse stores and products
- Add items to cart
- Place and track orders
- Cancel eligible orders
- View order history

### Store
- Manage store profile
- Create and manage products
- View and manage incoming orders
- Update order status
- View order history

### Delivery Partner
- View assigned deliveries
- Accept/reject assignments
- Update delivery status
- View delivery history
- Track earnings

### Admin
- Full platform access
- Manage users and stores
- Assign delivery partners
- View analytics
- Monitor all operations

## 🗄️ Database Schema

### User Model
Fields: name, email, password (hashed), phone, role, profileImage, address, location (lat/long)

### Store Model
Fields: owner, name, description, category, image, phone, address, location, deliveryRadius, minimumOrder, averagePreparationTime, isOpen, rating

### Product Model
Fields: store, name, description, category, price, image, stock, isAvailable

### Cart Model
Fields: customer, items (array with product, quantity, price, store), totalAmount

### Order Model
Fields: customer, store, deliveryPartner, items, subtotal, deliveryFee, tax, totalAmount, deliveryAddress, deliveryLocation, status, paymentMethod, paymentStatus, estimatedDeliveryTime

### Delivery Model
Fields: order, deliveryPartner, assignedBy, pickupLocation, deliveryLocation, status, timestamps (assigned, accepted, pickedUp, delivered), distance, estimatedTime

## 🎯 Order Lifecycle

```
PENDING
  ↓
CONFIRMED (Store accepts)
  ↓
PREPARING (Store preparing)
  ↓
READY_FOR_PICKUP (Ready)
  ↓
ASSIGNED (Dispatcher assigns delivery partner)
  ↓
ACCEPTED (Delivery partner accepts)
  ↓
PICKED_UP (Delivery partner picks up)
  ↓
OUT_FOR_DELIVERY (On the way)
  ↓
DELIVERED (Completed)
```

Alternative paths:
- CANCELLED (Customer or system)
- REJECTED (Store or delivery partner)
- FAILED (Delivery failed)

## 🧮 Delivery Assignment Logic

The system assigns delivery partners based on:
1. **Proximity**: Distance from pickup location
2. **Availability**: Partners with fewer active deliveries
3. **Acceptance Rate**: Historical performance
4. **Rating**: Partner ratings

The dispatcher can manually assign or override assignments.

## 🔄 Hyper-Local Logic

### Distance Calculation
Uses the Haversine formula to calculate great-circle distances between coordinates:

```
distance = 2R * arcsin(√(sin²(Δφ/2) + cos(φ1) * cos(φ2) * sin²(Δλ/2)))
```

Where R = 6371 km (Earth's radius)

### Store Availability
Customers only see stores within their delivery radius:
- Store defines delivery radius (e.g., 5 km)
- Only customers within that radius can order
- Distance is calculated from store to customer location

### Delivery Fee Calculation
```
deliveryFee = baseFee (30) + (distance * perKmFee (5))
```

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## ✅ Testing

### Manual Testing Workflow

1. **Register as Customer** and explore stores
2. **Add products to cart** from nearby stores
3. **Checkout** with delivery address and payment method
4. **Register as Store Owner** and manage products
5. **View and accept orders** in store dashboard
6. **Register as Delivery Partner** and accept deliveries
7. **Update delivery status** through the flow
8. **Login as Admin** to view dashboard and manage assignments

### API Testing
Use Postman or similar tools with:
- Base URL: `http://localhost:5000/api`
- Include `Authorization: Bearer {token}` in headers for protected routes

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Render/Railway/Heroku)
1. Set environment variables on platform
2. Push to Git repository
3. Platform automatically deploys from Git

### Database (MongoDB Atlas)
- Create cluster on MongoDB Atlas
- Update `MONGO_URI` in environment variables
- Add IP whitelist for production server

## 📊 Future Improvements

- [ ] Real-time notifications with Socket.io
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Ratings and reviews system
- [ ] Advanced analytics dashboard
- [ ] Promotion and discount management
- [ ] Multi-language support
- [ ] SMS and email notifications
- [ ] Driver tracking on map
- [ ] AI-based delivery time prediction
- [ ] Customer support chat
- [ ] Subscription and loyalty programs

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally OR use MongoDB Atlas URI
- Check `MONGO_URI` in `.env` file

### Port Already in Use
- Change PORT in `.env` (default: 5000)
- Or kill the process using the port

### CORS Errors
- Ensure `CLIENT_URL` matches your frontend URL
- Check CORS middleware in server.js

### Token Expiration
- Tokens expire after 7 days
- User will be redirected to login
- Clear localStorage if issues persist

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built as a comprehensive MERN stack project demonstrating real-world delivery platform architecture.

## 🤝 Contributing

Feel free to fork, modify, and enhance this project. Some areas for contribution:
- UI/UX improvements
- Additional features
- Bug fixes
- Documentation
- Tests

---

**Ready to run?** Start with `npm run dev` and visit `http://localhost:5173`!

🚀 Happy Coding!
