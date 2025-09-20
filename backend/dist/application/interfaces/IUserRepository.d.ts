import { User } from "../../domain/entities/User";
export interface IUserRepository {
    save(user: User): Promise<User>;
    findAll(): Promise<User[]>;
}
//# sourceMappingURL=IUserRepository.d.ts.map