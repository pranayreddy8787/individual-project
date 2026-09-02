# QuickDrop - Quick Setup Guide

## Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## Step 1: Navigate to Project
```bash
cd hyperlocal-delivery
```

## Step 2: Install Dependencies
```bash
npm run install-all
```

## Step 3: Set Up MongoDB

### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

### Option B: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `.env` file in server directory:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/quickdrop
```

## Step 4: Seed Sample Data
```bash
cd server
npm run seed
cd ..
```

This creates test users and sample data automatically.

## Step 5: Start the Application
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## Test Credentials

### Admin
- Email: `admin@quickdrop.com`
- Password: `admin123`

### Customer
- Email: `rajesh@example.com`
- Password: `password123`

### Store Owner
- Email: `foodhaven@example.com`
- Password: `password123`

### Delivery Partner
- Email: `rohan.delivery@example.com`
- Password: `password123`

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB service is running
- Verify connection string in `.env` file
- For local MongoDB: `mongodb://localhost:27017/quickdrop`
- For Atlas: Copy connection string from MongoDB Atlas

### Port Already in Use
- Change PORT in `server/.env` (default: 5000)
- React dev server uses 5173, change if needed in `vite.config.js`

### Dependencies Installation Failed
```bash
# Clear npm cache
npm cache clean --force
# Remove node_modules and lock files
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

### CORS Errors
- Make sure `CLIENT_URL` in `.env` matches frontend URL
- Default: `http://localhost:5173`

## File Structure Quick Reference

```
hyperlocal-delivery/
├── client/           → React frontend (Vite)
│   └── src/
│       ├── pages/    → Page components
│       ├── components/ → Reusable components
│       ├── context/  → Auth & Cart state
│       ├── services/ → API calls
│       └── utils/    → Helper functions
│
├── server/          → Express backend
│   ├── models/      → MongoDB schemas
│   ├── routes/      → API endpoints
│   ├── controllers/ → Business logic
│   ├── middleware/  → Auth, validation
│   └── scripts/     → Seed data
│
└── README.md        → Full documentation
```

## Running Different Scenarios

### Customer Flow
1. Register as customer
2. Click "Browse Stores" 
3. View nearby stores
4. Add products to cart
5. Checkout with delivery address
6. Track order status

### Store Flow
1. Register as store/restaurant
2. Login → Store Dashboard
3. Add products
4. View incoming orders
5. Accept/Reject orders
6. Update order status

### Delivery Partner Flow
1. Register as delivery partner
2. Login → Delivery Dashboard
3. View assigned deliveries
4. Accept delivery
5. Update status: Picked Up → Out for Delivery → Delivered

### Admin Flow
1. Login as admin@quickdrop.com
2. View dashboard stats
3. Manage all orders
4. Assign delivery partners
5. View all users and stores

## Key Features Working

✅ User registration and login
✅ Store management
✅ Product listing
✅ Shopping cart
✅ Order placement
✅ Order tracking
✅ Delivery assignment
✅ Status updates
✅ Role-based access control

## Next Steps

1. Test all user flows
2. Explore API endpoints with Postman
3. Extend functionality with more features
4. Deploy to production

## Support

Refer to README.md for full documentation including:
- Complete API documentation
- Database schema details
- Deployment instructions
- Future improvements roadmap

---

**Happy Coding! 🚀**
