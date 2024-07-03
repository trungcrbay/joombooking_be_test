import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({
        message: 'Name must not be empty'
    })
    name: string;

    @IsNotEmpty({
        message: 'Email must not be empty'
    })
    email: string;

    @IsNotEmpty({
        message: 'Phone must not be empty'
    })
    phone: string;

    @IsNotEmpty({
        message: 'description must not be empty'
    })
    address: string;

}


