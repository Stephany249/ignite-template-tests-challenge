import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let memoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Create User', () => {

  beforeEach(() => {
    memoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(memoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(memoryUsersRepository);
  });

  it('should be able to show user by id', async () => {
    const user = await createUserUseCase.execute({
      name: 'teste',
      email: 'teste@fiapi.com',
      password: '123'
    });


    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(profile.name).toEqual('teste');
  });

  it('should not be able to show an nonexistent use', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('1237')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  });
})
