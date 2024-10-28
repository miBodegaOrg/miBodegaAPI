import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/SignUp.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/SignIn.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProfileDto } from './dto/UpdateProfile.dto';
import { SendChangePasswordEmailDto } from './dto/SendChangePasswordEmail.dto';
import { ChangePasswordDto } from './dto/ChangePassword.dto';
import { ValidCodeDto } from './dto/ValidCode.dto';
import { ChangePasswordEmailDto } from './dto/ChangePasswordEmail.dto';

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

  @Put('change-password')
  @UseGuards(AuthGuard())
  changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user, changePasswordDto);
  }

  @Post('send-change-password-email')
  sendChangePasswordEmail(
    @Body() sendChangePasswordEmailDto: SendChangePasswordEmailDto,
  ) {
    return this.authService.sendChangePasswordEmail(sendChangePasswordEmailDto);
  }

  @Put('update-profile')
  @UseGuards(AuthGuard())
  updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user, updateProfileDto);
  }

  @Post('valid-code')
  validCode(@Body() validCodeDto: ValidCodeDto) {
    return this.authService.validCode(validCodeDto);
  }

  @Post('change-password-email')
  changePasswordEmail(@Body() changePasswordEmailDto: ChangePasswordEmailDto) {
    return this.authService.changePasswordEmail(changePasswordEmailDto);
  }
}
