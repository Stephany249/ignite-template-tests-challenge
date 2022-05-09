import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let memoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {

  beforeEach(() => {
    memoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(memoryUsersRepository);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'teste',
      email: 'teste@fiapi.com',
      password: '123'
    })

    expect(user).toHaveProperty('id');
  })

  it('should be able to create a new user', async () => {

    expect(async () => {
      await createUserUseCase.execute({
        name: 'teste',
        email: 'teste@fiapi.com',
        password: '123'
      })

      await createUserUseCase.execute({
        name: 'teste 2 ',
        email: 'teste@fiapi.com',
        password: '123'
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
