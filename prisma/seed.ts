import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.city.deleteMany();

  const cities = [
    {
      name: 'New York',
      country: 'United States',
      state: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      ibgeCode: 'NYC001',
    },
    {
      name: 'Los Angeles',
      country: 'United States',
      state: 'California',
      latitude: 34.0522,
      longitude: -118.2437,
      ibgeCode: 'LAC001',
    },
    {
      name: 'São Paulo',
      country: 'Brazil',
      state: 'São Paulo',
      latitude: -23.5505,
      longitude: -46.6333,
      ibgeCode: '3550308',
    },
    {
      name: 'Rio de Janeiro',
      country: 'Brazil',
      state: 'Rio de Janeiro',
      latitude: -22.9068,
      longitude: -43.1729,
      ibgeCode: '3304557',
    },
    {
      name: 'London',
      country: 'United Kingdom',
      state: 'England',
      latitude: 51.5074,
      longitude: -0.1278,
      ibgeCode: 'LDN001',
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      state: null,
      latitude: 35.6762,
      longitude: 139.6503,
      ibgeCode: 'TKY001',
    },
  ];

  for (const city of cities) {
    await prisma.city.create({
      data: city,
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
