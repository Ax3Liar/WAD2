
// models/userModel.js
import bcrypt from 'bcryptjs';
import { usersDb } from './_db.js';

export const UserModel = {
  async create(user) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return usersDb.insert({ ...user, password: hashedPassword });
  },
  async comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  },
  async findByEmail(email) {
    return usersDb.findOne({ email });
  },
  async findById(id) {
    return usersDb.findOne({ _id: id });
  }
};
