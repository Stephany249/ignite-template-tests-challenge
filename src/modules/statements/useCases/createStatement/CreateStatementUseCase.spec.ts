import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let memoryStatementsRepository: InMemoryStatementsRepository;
let memoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe('Create Statement', () => {

  beforeEach(() => {
    memoryStatementsRepository = new InMemoryStatementsRepository();
    memoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(memoryUsersRepository, memoryStatementsRepository);
  });

  it('should be able to create a new statement', async () => {
    const user = await memoryUsersRepository.create({
      name: 'teste',
      email: 'teste@fiapi.com',
      password: '123'
    });

    const deposit = {
      type: OperationType.DEPOSIT, amount: 15000, description: "Desenvolvimento de uma aplicação"
    };

    const statementWithdrawCreated = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: deposit.type,
      amount: deposit.amount,
      description: deposit.description
    });

    const withdraw = {
      type: OperationType.WITHDRAW, amount: 2400, description: "Aluguel"
    };

    const statementDepositCreated = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: withdraw.type,
      amount: withdraw.amount,
      description: withdraw.description
    });

    expect(statementDepositCreated).toHaveProperty("id")
    expect(statementWithdrawCreated).toHaveProperty("id")
  });

  it("should not be able to create a new statement with nonexistent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({ user_id: '12345', type: OperationType.DEPOSIT, amount: 120000, description: 'Teste'})
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

it("should not be able to create a new statement with balance less than amount", () => {
    expect(async () => {
      const user = await memoryUsersRepository.create({
        name: 'teste',
        email: 'teste@fiapi.com',
        password: '123'
      });

      const statement = {
        type: OperationType.WITHDRAW, amount: 10000, description: "Desenvolvimento de uma aplicação"
      }

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: statement.type,
        amount: statement.amount,
        description: statement.description
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });
})

