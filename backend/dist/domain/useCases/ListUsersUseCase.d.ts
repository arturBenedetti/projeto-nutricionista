import { User } from "../entities/User";
import { IUserRepository } from "../../application/interfaces/IUserRepository";
export declare class ListUsersUseCase {
    private userRepo;
    constructor(userRepo: IUserRepository);
    execute(): Promise<User[]>;
}
//# sourceMappingURL=ListUsersUseCase.d.ts.map