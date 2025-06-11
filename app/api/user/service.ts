import { AppDataSource } from '@/app/api/db/config';
import { UserEntity } from '../db/entities/user';

export class UserService {
  private static async getRepo() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    return AppDataSource.getRepository(UserEntity);
  }

  static async findAll(): Promise<UserEntity[]> {
    const repo = await this.getRepo();
    return repo.find();
  }

  static async create(data: { name: string; email: string }): Promise<UserEntity> {
    const repo = await this.getRepo();
    const user = repo.create(data);
    return repo.save(user);
  }
}
