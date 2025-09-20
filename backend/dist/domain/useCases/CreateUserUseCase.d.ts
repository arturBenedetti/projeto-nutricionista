import { User } from "../entities/User";
import { IUserRepository } from "../../application/interfaces/IUserRepository";
import { CreateUserDTO } from "../../application/dtos/CreateUserDTO";
export declare class CreateUserUseCase {
    private userRepo;
    constructor(userRepo: IUserRepository);
    execute(data: CreateUserDTO): Promise<User>;
}
//# sourceMappingURL=CreateUserUseCase.d.ts.map