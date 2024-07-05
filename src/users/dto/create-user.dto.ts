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
    phone: number;

    @IsNotEmpty({
        message: 'Description must not be empty'
    })
    address: string;

    @IsNotEmpty({
        message: 'Status must be true or false'
    })
    status: boolean;

    @IsNotEmpty({
        message: 'Age must not be empty'
    })
    age: number;

}


