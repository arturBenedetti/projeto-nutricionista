"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const User_1 = require("../entities/User");
class CreateUserUseCase {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute(data) {
        const user = new User_1.User(Date.now().toString(), data.name, data.email);
        return await this.userRepo.save(user);
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
//# sourceMappingURL=CreateUserUseCase.js.map