import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let memoryStatementsRepository: InMemoryStatementsRepository;
let memoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get Statement Operation', () => {

  beforeEach(() => {
    memoryStatementsRepository = new InMemoryStatementsRepository();
    memoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(memoryUsersRepository, memoryStatementsRepository);
  });

  it('should be able to show a statement operation by user id', async () => {
    const user = await memoryUsersRepository.create({
      name: 'teste',
      email: 'teste@fiapi.com',
      password: '123'
    });

    const deposit = {
      type: OperationType.DEPOSIT, amount: 15000, description: "Desenvolvimento de uma aplicação"
    };

    const statementDepositCreated = await memoryStatementsRepository.create({
      user_id: user.id as string,
      type: deposit.type,
      amount: deposit.amount,
      description: deposit.description
    });

    expect(statementDepositCreated).toHaveProperty("id")
    expect(statementDepositCreated).toHaveProperty("type")
  });

  it("should not be able to show a statement operation with nonexistent user", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({ user_id: "1234", statement_id: "123456" })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to show a statement operation with nonexistent statement", () => {
    expect(async () => {
      const user = await memoryUsersRepository.create({
        name: 'teste',
        email: 'teste@fiapi.com',
        password: '123'
      });

      await getStatementOperationUseCase.execute({ user_id: user.id as string, statement_id: "123456" })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})

