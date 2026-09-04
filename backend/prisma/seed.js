const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const adminPassword = await bcrypt.hash('Admin@1234', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@storerating.com' },
    update: {},
    create: {
      name: 'System Administrator User',
      email: 'admin@storerating.com',
      passwordHash: adminPassword,
      address: '123 Admin Street, Tech City, TC 10001',
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create a sample store owner
  const ownerPassword = await bcrypt.hash('Owner@1234', 12);
  
  const storeOwner = await prisma.user.upsert({
    where: { email: 'owner@coffeeplace.com' },
    update: {},
    create: {
      name: 'Coffee Place Store Owner',
      email: 'owner@coffeeplace.com',
      passwordHash: ownerPassword,
      address: '456 Coffee Lane, Brew Town, BT 20002',
      role: 'STORE_OWNER',
    },
  });

  console.log(`✅ Store owner created: ${storeOwner.email}`);

  // Create a sample store
  const store = await prisma.store.upsert({
    where: { email: 'info@coffeeplace.com' },
    update: {},
    create: {
      name: 'The Coffee Place',
      email: 'info@coffeeplace.com',
      address: '456 Coffee Lane, Brew Town, BT 20002',
      ownerId: storeOwner.id,
    },
  });

  console.log(`✅ Store created: ${store.name}`);

  // Create a sample normal user
  const userPassword = await bcrypt.hash('User@12345', 12);
  
  const normalUser = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe Normal Regular User',
      email: 'john@example.com',
      passwordHash: userPassword,
      address: '789 User Avenue, App City, AC 30003',
      role: 'NORMAL_USER',
    },
  });

  console.log(`✅ Normal user created: ${normalUser.email}`);

  // Create a sample rating
  await prisma.rating.upsert({
    where: {
      unique_user_store_rating: {
        userId: normalUser.id,
        storeId: store.id,
      },
    },
    update: { rating: 4 },
    create: {
      userId: normalUser.id,
      storeId: store.id,
      rating: 4,
    },
  });

  console.log('✅ Sample rating created');
  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Default Credentials:');
  console.log('   Admin:       admin@storerating.com / Admin@1234');
  console.log('   Store Owner: owner@coffeeplace.com / Owner@1234');
  console.log('   Normal User: john@example.com / User@12345');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
