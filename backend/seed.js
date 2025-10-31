import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Session from './models/Session.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for travel and work.',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 50,
    category: 'Electronics',
    isActive: true
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your health and fitness with heart rate monitoring, GPS, sleep tracking, and 50+ sport modes. Water-resistant up to 50m.',
    price: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 75,
    category: 'Electronics',
    isActive: true
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable premium cotton t-shirt. Available in multiple colors. Eco-friendly and ethically made.',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    stock: 200,
    category: 'Fashion',
    isActive: true
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360° sound, waterproof design, 20-hour playtime. Perfect for outdoor adventures and parties. Deep bass and crystal clear audio.',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    stock: 120,
    category: 'Electronics',
    isActive: true
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick 6mm eco-friendly yoga mat with excellent grip and cushioning. Includes carrying strap. Non-slip surface.',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    stock: 85,
    category: 'Sports',
    isActive: true
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated 32oz water bottle keeps drinks cold for 24h or hot for 12h. BPA-free, leak-proof, and eco-friendly.',
    price: 34.99,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    stock: 150,
    category: 'Sports',
    isActive: true
  },
  {
    name: 'Aromatherapy Essential Oil Set',
    description: 'Premium essential oils set with 6 different scents. Perfect for relaxation, stress relief, and home fragrance. 100% pure.',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
    stock: 95,
    category: 'Beauty',
    isActive: true
  },
  {
    name: 'LED Desk Lamp',
    description: 'Adjustable LED desk lamp with touch control, 3 color modes, and USB charging port. Energy-efficient and eye-caring.',
    price: 44.99,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    stock: 65,
    category: 'Home',
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/live-commerce');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Session.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${products.length} products`);

    // Create a sample session
    const session = await Session.create({
      title: 'Summer Sale Spectacular',
      description: 'Join us for amazing deals on our top products! Limited time offers and exclusive discounts.',
      products: products.slice(0, 5).map(p => p._id), // First 5 products
      status: 'scheduled',
      startTime: new Date()
    });
    console.log('✅ Created sample session');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Products: ${products.length}`);
    console.log(`   Sessions: 1`);
    console.log('\n💡 Next steps:');
    console.log('   1. Start the backend: npm run dev');
    console.log('   2. Start the frontend: cd frontend && npm run dev');
    console.log('   3. Go to Admin Dashboard to start the live session');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
