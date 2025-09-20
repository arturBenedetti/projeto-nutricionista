"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_js_1 = require("../entities/User.js");
class UserService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async createUser(name, email) {
        const user = new User_js_1.User(Date.now().toString(), name, email);
        return await this.userRepo.save(user);
    }
    async getAllUsers() {
        return await this.userRepo.findAll();
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map