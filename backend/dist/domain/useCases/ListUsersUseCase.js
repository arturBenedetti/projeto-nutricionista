"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersUseCase = void 0;
class ListUsersUseCase {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async execute() {
        return await this.userRepo.findAll();
    }
}
exports.ListUsersUseCase = ListUsersUseCase;
//# sourceMappingURL=ListUsersUseCase.js.map