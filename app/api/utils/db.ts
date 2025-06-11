import { AppDataSource } from "../db/config";

let isInitialized = false;

export async function initDB() {
    try{
    if (!isInitialized) {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('✅ TypeORM DB Initialized');
        }
        isInitialized = true;
    }
    return AppDataSource;
}catch (error) {
    console.error('❌ Error initializing TypeORM DB:', error);
    throw error; // Re-throw to handle it in the calling function
}
}

// Optional: helper to get a repository directly
export async function getRepo(entity: any) {
    const db = await initDB();
    return db.getRepository(entity);
}

export async function createService<T extends { init(): Promise<void> }>(
  ServiceClass: new () => T
): Promise<T> {
  const service = new ServiceClass();
  await service.init();
  return service;
}
