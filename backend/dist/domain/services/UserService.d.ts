import { User } from "../entities/User.js";
import { IUserRepository } from "../../application/interfaces/IUserRepository.js";
export declare class UserService {
    private userRepo;
    constructor(userRepo: IUserRepository);
    createUser(name: string, email: string): Promise<User>;
    getAllUsers(): Promise<User[]>;
}
//# sourceMappingURL=UserService.d.ts.map