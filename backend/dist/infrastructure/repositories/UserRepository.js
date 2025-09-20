"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    constructor(db) {
        this.collection = db.collection("users");
    }
    async save(user) {
        await this.collection.insertOne(user);
        return user;
    }
    async findAll() {
        return await this.collection.find().toArray();
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map