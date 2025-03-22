import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './infra/database/seeds/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seedService = app.get(SeedService);
  
  try {
    await seedService.seed();
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap(); 