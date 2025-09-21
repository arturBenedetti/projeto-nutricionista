"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const CreateUserUseCase_1 = require("../../domain/useCases/CreateUserUseCase");
const ListUsersUseCase_1 = require("../../domain/useCases/ListUsersUseCase");
class UserController {
    constructor(userRepo) {
        this.createUser = new CreateUserUseCase_1.CreateUserUseCase(userRepo);
        this.listUsers = new ListUsersUseCase_1.ListUsersUseCase(userRepo);
    }
    async create(req) {
        return await this.createUser.execute(req);
    }
    async list() {
        return await this.listUsers.execute();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map