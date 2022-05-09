import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let memoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {

  beforeEach(() => {
    memoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(memoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(memoryUsersRepository)
  });

  it('should be able to authenticate an user', async () => {
    const user = await createUserUseCase.execute({
      name: 'teste',
      email: 'teste@fiapi.com',
      password: '123'
    });

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: '123'
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with incorrect password', async () => {
    const user = await createUserUseCase.execute({
      name: 'teste',
      email: 'teste@fiapi.com',
      password: '123'
    });


    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: '1237'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });

  it('should not be able to authenticate an nonexistent user', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'teste@fiapi.com',
        password: '1237'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  });


})
