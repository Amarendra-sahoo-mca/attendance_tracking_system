import { AppDataSource } from '../config'; // Note the .js extension for ts-node/esm
import { UserEntity } from '../entities/user';

export async function seed() {
  try {
    await AppDataSource.initialize(); // 👈 this is essential!

    const userRepo = AppDataSource.getRepository(UserEntity);

    const newUser = userRepo.create({
      password: 'Amar@123',
      email: 'amar@example.com',
    });

    await userRepo.save(newUser);
    console.log('✅ Seeded one user!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

// seed();
