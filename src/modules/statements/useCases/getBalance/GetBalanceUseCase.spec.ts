import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let memoryStatementsRepository: InMemoryStatementsRepository;
let memoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe('Create User', () => {

  beforeEach(() => {
    memoryStatementsRepository = new InMemoryStatementsRepository();
    memoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(memoryStatementsRepository, memoryUsersRepository);
  });

  it('should be able to show a balance by user id', async () => {
    const user = await memoryUsersRepository.create({
      name: 'teste',
      email: 'teste@fiapi.com',
      password: '123'
    });

    const deposit = {
      type: OperationType.DEPOSIT, amount: 15000, description: "Desenvolvimento de uma aplicação"
    };

    await memoryStatementsRepository.create({
      user_id: user.id as string,
      type: deposit.type,
      amount: deposit.amount,
      description: deposit.description
    });

    const withdraw = {
      type: OperationType.WITHDRAW, amount: 2400, description: "Aluguel"
    };

    await memoryStatementsRepository.create({
      user_id: user.id as string,
      type: withdraw.type,
      amount: withdraw.amount,
      description: withdraw.description
    });

    const response = await getBalanceUseCase.execute({ user_id: user.id as string })

    expect(response.statement.length).toBe(2)
    expect(response.balance).toBe(12600)
  });

  it("should not be able to show a balance with nonexistent user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "1234" })
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

})
