
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123'; // Initial password

    const existingUser = await usersService.findOne(adminEmail);
    if (existingUser) {
        console.log('Super Admin already exists.');
    } else {
        // We can't use usersService.create directly because it hashes the password again if we are not careful,
        // but looking at usersService.create, it DOES hash the password.
        // So we can pass the raw password.
        await usersService.create({
            email: adminEmail,
            password: adminPassword,
            role: UserRole.SUPER_ADMIN,
            name: 'Super Admin',
        });
        console.log(`Super Admin created with email: ${adminEmail} and password: ${adminPassword}`);
    }

    await app.close();
}
bootstrap();
