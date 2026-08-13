import { Body, Controller, Get, InternalServerErrorException, Patch, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Get('me')
  async me(@Req() req: any) {
    const user = await this.userModel.findById(req.userId);
    if (!user) throw new InternalServerErrorException('User not found for token');
    return user;
  }

  @Patch('me')
  async updateMe(@Body() dto: UpdateUserDto, @Req() req: any) {
    const user = await this.userModel.findByIdAndUpdate(req.userId, dto, { new: true });
    if (!user) throw new InternalServerErrorException('User not found for token');
    return user;
  }
}
