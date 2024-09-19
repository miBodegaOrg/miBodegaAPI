import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/SignUp.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/SignIn.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  signIn(@Body() signInShopDto: SignInDto) {
    return this.authService.signIn(signInShopDto);
  }

  @Post('remember-credentials')
  @UseGuards(AuthGuard())
  rememberCredentials(@Req() req) {
    return this.authService.rememberCredentials(req.user);
  }
}
