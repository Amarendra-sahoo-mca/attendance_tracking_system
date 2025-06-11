import { NextResponse } from 'next/server';
import { UserService } from './service';

export class UserController {
  static async getAll() {
    try {
      const users = await UserService.findAll();
      return NextResponse.json(users);
    } catch (err) {
      console.error('GetAll Error:', err);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
  }

  static async create(request: Request) {
    try {
      const body = await request.json();
      const user = await UserService.create(body);
      return NextResponse.json(user, { status: 201 });
    } catch (err) {
      console.error('Create Error:', err);
      return NextResponse.json({ error: 'User creation failed' }, { status: 400 });
    }
  }
}
