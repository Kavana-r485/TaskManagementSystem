import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // "Continue as Guest" button on the login screen calls this.
  // Creates a throwaway user so tasks/projects can still have an owner,
  // then signs a JWT the frontend stores and sends on every request.
  async guestLogin() {
    const guest = await this.userModel.create({
      provider: 'guest',
      fullName: 'Guest',
      username: `guest-${Math.random().toString(36).slice(2, 8)}`,
    });

    const token = this.jwtService.sign({ sub: guest._id, provider: 'guest' });

    return { accessToken: token, user: guest };
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }
}
