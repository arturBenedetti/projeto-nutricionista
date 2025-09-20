import { IUserRepository } from "../interfaces/IUserRepository";
import { CreateUserDTO } from "../dtos/CreateUserDTO";
export declare class UserController {
    private createUser;
    private listUsers;
    constructor(userRepo: IUserRepository);
    create(req: CreateUserDTO): Promise<import("../../domain/entities/User").User>;
    list(): Promise<import("../../domain/entities/User").User[]>;
}
//# sourceMappingURL=UserController.d.ts.map