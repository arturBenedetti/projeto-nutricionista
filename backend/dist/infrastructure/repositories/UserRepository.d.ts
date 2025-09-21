import { IUserRepository } from "../../application/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";
import { Db } from "mongodb";
export declare class UserRepository implements IUserRepository {
    private collection;
    constructor(db: Db);
    save(user: User): Promise<User>;
    findAll(): Promise<User[]>;
}
//# sourceMappingURL=UserRepository.d.ts.map