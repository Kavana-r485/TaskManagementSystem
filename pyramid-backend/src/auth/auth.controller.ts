import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  guestLogin() {
    return this.authService.guestLogin();
  }

  // Google login (optional / stretch goal — documented as a deviation
  // in the README if you run out of time to wire up real OAuth):
  // @Post('google') googleLogin(@Body() dto: GoogleLoginDto) { ... }
}
