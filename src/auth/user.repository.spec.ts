import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.respository";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { User } from "./user.entity";
import * as bcrypt from 'bcryptjs';

const mockCredentialsDto = { username: 'Test username', password: 'TestPassword'};

describe('UserRepository', ()=> {
    let userRepository;

    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers: [
                UserRepository,
            ],
        }).compile();
        userRepository =  await module.get<UserRepository>(UserRepository);

    });

    describe('signUp', ()=>{
        let save;

        beforeEach(()=>{
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({save});
        });
        it('successfully signs up the user',()=>{
            save.mockResolvedValue(undefined);
            return expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
        });

        it('thorws a conflic exception  as username already exists',async()=>{
            save.mockRejectedValue({code: '23505'});
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
        });

        it('thorws a conflic exception  as username already exists',async()=>{
            save.mockRejectedValue({code: '12312'}); // unhandled error code
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        })
    });


    describe('validateUserPassword',()=>{

        let user;
        beforeEach(()=>{
            userRepository.findOne = jest.fn();
            user = new User();
            user.username = "Test username";
            user.validatePassword = jest.fn();

        });

        it('returns the username as validation was successful',async ()=>{
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);
            const result =  await userRepository.validateUserPassword(mockCredentialsDto);
            expect(result).toEqual('Test username');

        });

        it('returns null as user cannot be found',async ()=>{
            userRepository.findOne.mockResolvedValue(null);
            const result =  await userRepository.validateUserPassword(mockCredentialsDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('returns null as password is invalid',async ()=>{
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);
            const result =  await userRepository.validateUserPassword(mockCredentialsDto);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();

        });
    });

    describe('hashPassword', ()=>{
        it('calls bcrypt.hash to generate a hash',async ()=>{
            bcrypt.hash = jest.fn().mockResolvedValue('testHash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword('testPassword', 'testSalt');
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
            expect(result).toEqual('testHash');


        });
    });
});