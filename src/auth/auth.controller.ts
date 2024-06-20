import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/SignUp.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignInShopDto } from './dto/SignInShop.dto';
import { SignInEmployeeDto } from './dto/SignInEmployee.dto';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('shop/signup')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto)
    }

    @Post('shop/signin')
    signIn(@Body() signInShopDto: SignInShopDto) {
        return this.authService.signInShop(signInShopDto)
    }

    @Post('employee/signin')
    signInEmployee(@Body() signInEmployeeDto: SignInEmployeeDto) {
       return this.authService.signInEmployee(signInEmployeeDto)
    }
}
