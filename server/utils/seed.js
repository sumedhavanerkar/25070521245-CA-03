import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Item from '../models/Item.js';
import User from '../models/User.js';

const seedData = {
  users: [
    { name: 'Admin User', email: 'admin@campus.edu', passwordHash: 'Admin@12345', role: 'admin' },
    { name: 'Priya Sharma', email: 'priya@student.edu', passwordHash: 'Student@123', role: 'student' },
    { name: 'Rahul Verma', email: 'rahul@student.edu', passwordHash: 'Student@123', role: 'student' },
  ],
  items: [
    {
      title: 'Blue College ID Card',
      description: 'Found a blue college ID card near the library entrance. Belongs to a 3rd-year student. Please bring any identifying details to claim.',
      type: 'found',
      category: 'ID Card',
      location: 'Library',
      eventDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      distinguishingFeatures: 'Blue lanyard attached, 2023-24 batch',
      contactName: 'Priya Sharma',
      status: 'active',
      reporterDisplayName: 'Priya Sharma',
    },
    {
      title: 'iPhone 13 (Black)',
      description: 'Lost my black iPhone 13 in the cafeteria during lunch. Has a crack on the back cover. Lock screen wallpaper is a mountain photo.',
      type: 'lost',
      category: 'Mobile Phone',
      location: 'Cafeteria / Canteen',
      eventDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      distinguishingFeatures: 'Crack on back cover, mountain wallpaper, no passcode visible',
      contactName: 'Rahul Verma',
      status: 'active',
      reporterDisplayName: 'Rahul Verma',
    },
    {
      title: 'Brown Leather Wallet',
      description: 'Lost my brown leather wallet containing college ID, some cash, and an ATM card. Lost somewhere near the sports ground.',
      type: 'lost',
      category: 'Wallet',
      location: 'Sports Ground',
      eventDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      distinguishingFeatures: 'Brown leather, initials "RV" embossed on front',
      contactName: 'Rahul Verma',
      status: 'active',
      reporterDisplayName: 'Rahul Verma',
    },
    {
      title: 'Data Structures Textbook',
      description: 'Found a Data Structures and Algorithms textbook by Cormen. Has handwritten notes in the margins. Found in Lecture Hall Block A, Row 4.',
      type: 'found',
      category: 'Books & Notebooks',
      location: 'Lecture Hall Block A',
      eventDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      distinguishingFeatures: 'Name written on first page (partially visible), yellow sticky notes',
      contactName: 'Priya Sharma',
      status: 'active',
      reporterDisplayName: 'Priya Sharma',
    },
    {
      title: 'Set of 3 Keys on Ring',
      description: 'Found a key ring with 3 keys near the parking area. One key has a red tag. Submitted to admin office.',
      type: 'found',
      category: 'Keys',
      location: 'Parking Area',
      eventDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      distinguishingFeatures: 'Red tag on one key, small car key included',
      contactName: 'Priya Sharma',
      status: 'active',
      reporterDisplayName: 'Priya Sharma',
    },
    {
      title: 'Sony WH-1000XM4 Headphones',
      description: 'Lost my Sony noise-cancelling headphones in the computer lab. Black colour with a grey carry case.',
      type: 'lost',
      category: 'Earphones & Headphones',
      location: 'Computer Lab',
      eventDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      distinguishingFeatures: 'Sony WH-1000XM4, black, small scratch on left ear cup',
      contactName: 'Rahul Verma',
      status: 'active',
      reporterDisplayName: 'Rahul Verma',
    },
    {
      title: 'Black Nike Backpack',
      description: 'Found a black Nike backpack in the garden area. Contains notebooks and a pencil case. Submitting to security.',
      type: 'found',
      category: 'Bag & Backpack',
      location: 'Garden / Open Area',
      eventDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      distinguishingFeatures: 'Nike logo, black, red zipper, contains notebooks',
      contactName: 'Priya Sharma',
      status: 'resolved',
      reporterDisplayName: 'Priya Sharma',
    },
    {
      title: 'Blue Stainless Steel Water Bottle',
      description: 'Lost a blue stainless-steel water bottle (Milton brand, 1 litre) near the girls hostel entrance.',
      type: 'lost',
      category: 'Water Bottle',
      location: 'Girls Hostel',
      eventDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      distinguishingFeatures: 'Blue, Milton brand, sticker of a sunflower on side',
      contactName: 'Priya Sharma',
      status: 'active',
      reporterDisplayName: 'Priya Sharma',
    },
  ],
};

const seed = async () => {
  console.log('🌱 Starting seed process...');
  await connectDB();

  console.log('🗑️  Clearing existing data...');
  await Item.deleteMany({});
  await User.deleteMany({});

  console.log('👤 Creating users...');
  const createdUsers = await User.insertMany(
    seedData.users.map((u) => ({ ...u }))
  );
  // insertMany bypasses pre-save hooks — we need to save individually for password hashing
  await User.deleteMany({});
  const users = [];
  for (const u of seedData.users) {
    const user = new User(u);
    await user.save();
    users.push(user);
  }

  const [, priya, rahul] = users;

  console.log('📦 Creating items...');
  const itemsWithUsers = seedData.items.map((item) => ({
    ...item,
    reportedBy: item.reporterDisplayName === 'Priya Sharma' ? priya._id : rahul._id,
  }));

  await Item.insertMany(itemsWithUsers);

  const count = await Item.countDocuments();
  console.log(`\n✅ Seed complete!`);
  console.log(`   👤 Users created: ${users.length}`);
  console.log(`   📦 Items created: ${count}`);
  console.log('\n🔑 Demo login credentials:');
  console.log('   Admin  → admin@campus.edu    / Admin@12345');
  console.log('   Student → priya@student.edu  / Student@123');
  console.log('   Student → rahul@student.edu  / Student@123\n');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
