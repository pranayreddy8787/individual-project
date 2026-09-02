require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');

const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Store.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@quickdrop.com',
      password: 'admin123',
      phone: '9000000000',
      role: 'admin',
    });

    // Create customers
    const customers = await User.insertMany([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: 'password123',
        phone: '9876543210',
        role: 'customer',
        address: 'Sector 44, Noida',
        location: { latitude: 28.5355, longitude: 77.3869 },
      },
      {
        name: 'Priya Singh',
        email: 'priya@example.com',
        password: 'password123',
        phone: '9876543211',
        role: 'customer',
        address: 'Sector 50, Noida',
        location: { latitude: 28.5244, longitude: 77.3930 },
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        password: 'password123',
        phone: '9876543212',
        role: 'customer',
        address: 'Sector 15, Noida',
        location: { latitude: 28.5821, longitude: 77.3654 },
      },
      {
        name: 'Neha Gupta',
        email: 'neha@example.com',
        password: 'password123',
        phone: '9876543213',
        role: 'customer',
        address: 'Sector 18, Noida',
        location: { latitude: 28.5954, longitude: 77.3643 },
      },
      {
        name: 'Vikram Sharma',
        email: 'vikram@example.com',
        password: 'password123',
        phone: '9876543214',
        role: 'customer',
        address: 'DLF City, Phase 4',
        location: { latitude: 28.5038, longitude: 77.2114 },
      },
    ]);

    // Create store owners
    const storeOwners = await User.insertMany([
      {
        name: 'Raj Malhotra',
        email: 'foodhaven@example.com',
        password: 'password123',
        phone: '8765432100',
        role: 'store',
        address: 'Sector 45, Noida',
        location: { latitude: 28.5318, longitude: 77.3855 },
      },
      {
        name: 'Priya Bose',
        email: 'grocerykart@example.com',
        password: 'password123',
        phone: '8765432101',
        role: 'store',
        address: 'Sector 50, Noida',
        location: { latitude: 28.5244, longitude: 77.3930 },
      },
      {
        name: 'Arun Singh',
        email: 'fastfood@example.com',
        password: 'password123',
        phone: '8765432102',
        role: 'store',
        address: 'Sector 52, Noida',
        location: { latitude: 28.5181, longitude: 77.4074 },
      },
      {
        name: 'Meera Iyer',
        email: 'healthfood@example.com',
        password: 'password123',
        phone: '8765432103',
        role: 'store',
        address: 'Sector 43, Noida',
        location: { latitude: 28.5389, longitude: 77.3789 },
      },
      {
        name: 'Suresh Nair',
        email: 'megamart@example.com',
        password: 'password123',
        phone: '8765432104',
        role: 'store',
        address: 'Sector 41, Noida',
        location: { latitude: 28.5457, longitude: 77.3724 },
      },
    ]);

    // Create stores
    const stores = await Store.insertMany([
      {
        owner: storeOwners[0]._id,
        name: 'Food Haven',
        description: 'Quality food and cuisines',
        category: 'food',
        phone: '8765432100',
        address: 'Sector 45, Noida',
        location: { latitude: 28.5318, longitude: 77.3855 },
        deliveryRadius: 5,
        minimumOrder: 150,
        averagePreparationTime: 25,
        rating: 4.5,
      },
      {
        owner: storeOwners[1]._id,
        name: 'Grocery Kart',
        description: 'Fresh vegetables and groceries',
        category: 'grocery',
        phone: '8765432101',
        address: 'Sector 50, Noida',
        location: { latitude: 28.5244, longitude: 77.3930 },
        deliveryRadius: 8,
        minimumOrder: 200,
        averagePreparationTime: 15,
        rating: 4.2,
      },
      {
        owner: storeOwners[2]._id,
        name: 'Fast Food Dhabha',
        description: 'Quick and delicious food',
        category: 'food',
        phone: '8765432102',
        address: 'Sector 52, Noida',
        location: { latitude: 28.5181, longitude: 77.4074 },
        deliveryRadius: 6,
        minimumOrder: 100,
        averagePreparationTime: 20,
        rating: 4.3,
      },
      {
        owner: storeOwners[3]._id,
        name: 'Health Food Store',
        description: 'Organic and healthy options',
        category: 'grocery',
        phone: '8765432103',
        address: 'Sector 43, Noida',
        location: { latitude: 28.5389, longitude: 77.3789 },
        deliveryRadius: 7,
        minimumOrder: 250,
        averagePreparationTime: 30,
        rating: 4.6,
      },
      {
        owner: storeOwners[4]._id,
        name: 'Mega Mart',
        description: 'All kinds of groceries and daily needs',
        category: 'grocery',
        phone: '8765432104',
        address: 'Sector 41, Noida',
        location: { latitude: 28.5457, longitude: 77.3724 },
        deliveryRadius: 10,
        minimumOrder: 300,
        averagePreparationTime: 20,
        rating: 4.4,
      },
    ]);

    // Create products
    const products = [
      // Food Haven products
      { store: stores[0]._id, name: 'Biryani', price: 250, category: 'main', stock: 50 },
      { store: stores[0]._id, name: 'Butter Chicken', price: 280, category: 'main', stock: 40 },
      { store: stores[0]._id, name: 'Naan', price: 40, category: 'bread', stock: 100 },
      { store: stores[0]._id, name: 'Coke', price: 60, category: 'beverage', stock: 80 },
      { store: stores[0]._id, name: 'Gulab Jamun', price: 80, category: 'dessert', stock: 60 },
      // Grocery Kart products
      { store: stores[1]._id, name: 'Tomatoes', price: 30, category: 'vegetables', stock: 100 },
      { store: stores[1]._id, name: 'Potatoes', price: 25, category: 'vegetables', stock: 150 },
      { store: stores[1]._id, name: 'Rice (1kg)', price: 60, category: 'grains', stock: 80 },
      { store: stores[1]._id, name: 'Wheat Flour (1kg)', price: 45, category: 'flour', stock: 70 },
      { store: stores[1]._id, name: 'Milk (1L)', price: 50, category: 'dairy', stock: 100 },
      // Fast Food Dhabha products
      { store: stores[2]._id, name: 'Burger', price: 120, category: 'main', stock: 50 },
      { store: stores[2]._id, name: 'Pizza', price: 200, category: 'main', stock: 40 },
      { store: stores[2]._id, name: 'French Fries', price: 80, category: 'sides', stock: 100 },
      { store: stores[2]._id, name: 'Ice Cream', price: 60, category: 'dessert', stock: 80 },
      { store: stores[2]._id, name: 'Momos', price: 100, category: 'snacks', stock: 60 },
      // Health Food Store products
      { store: stores[3]._id, name: 'Organic Apples', price: 120, category: 'fruits', stock: 40 },
      { store: stores[3]._id, name: 'Almonds', price: 500, category: 'nuts', stock: 30 },
      { store: stores[3]._id, name: 'Honey', price: 300, category: 'condiments', stock: 20 },
      { store: stores[3]._id, name: 'Quinoa', price: 400, category: 'grains', stock: 25 },
      { store: stores[3]._id, name: 'Olive Oil', price: 600, category: 'oils', stock: 15 },
      // Mega Mart products
      { store: stores[4]._id, name: 'Biscuits', price: 40, category: 'snacks', stock: 200 },
      { store: stores[4]._id, name: 'Tea Bags', price: 100, category: 'beverages', stock: 100 },
      { store: stores[4]._id, name: 'Coffee', price: 250, category: 'beverages', stock: 60 },
      { store: stores[4]._id, name: 'Soap', price: 35, category: 'personal', stock: 150 },
      { store: stores[4]._id, name: 'Shampoo', price: 80, category: 'personal', stock: 100 },
      { store: stores[4]._id, name: 'Toothpaste', price: 60, category: 'personal', stock: 120 },
    ];

    await Product.insertMany(products);

    // Create delivery partners
    const deliveryPartners = await User.insertMany([
      {
        name: 'Rohan Kumar',
        email: 'rohan.delivery@example.com',
        password: 'password123',
        phone: '7654321000',
        role: 'delivery_partner',
        address: 'Sector 46, Noida',
        location: { latitude: 28.5280, longitude: 77.3880 },
      },
      {
        name: 'Arjun Singh',
        email: 'arjun.delivery@example.com',
        password: 'password123',
        phone: '7654321001',
        role: 'delivery_partner',
        address: 'Sector 51, Noida',
        location: { latitude: 28.5200, longitude: 77.3950 },
      },
      {
        name: 'Karan Patel',
        email: 'karan.delivery@example.com',
        password: 'password123',
        phone: '7654321002',
        role: 'delivery_partner',
        address: 'Sector 44, Noida',
        location: { latitude: 28.5330, longitude: 77.3900 },
      },
      {
        name: 'Aditya Sharma',
        email: 'aditya.delivery@example.com',
        password: 'password123',
        phone: '7654321003',
        role: 'delivery_partner',
        address: 'Sector 48, Noida',
        location: { latitude: 28.5240, longitude: 77.3840 },
      },
      {
        name: 'Nikhil Verma',
        email: 'nikhil.delivery@example.com',
        password: 'password123',
        phone: '7654321004',
        role: 'delivery_partner',
        address: 'Sector 53, Noida',
        location: { latitude: 28.5150, longitude: 77.4050 },
      },
    ]);

    console.log('Seed data created successfully!');
    console.log(`\nCreated:`);
    console.log(`- 1 Admin`);
    console.log(`- 5 Customers`);
    console.log(`- 5 Store Owners`);
    console.log(`- 5 Stores`);
    console.log(`- 25 Products`);
    console.log(`- 5 Delivery Partners`);
    console.log(`\nTest Credentials:`);
    console.log(`Admin: admin@quickdrop.com / admin123`);
    console.log(`Customer: rajesh@example.com / password123`);
    console.log(`Store: foodhaven@example.com / password123`);
    console.log(`Delivery Partner: rohan.delivery@example.com / password123`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
