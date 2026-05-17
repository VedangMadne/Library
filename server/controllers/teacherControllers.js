import { TransactionModel } from "../models/transaction-models.js";
import UserModel from "../models/user-model.js";
import {
  generateRandomPassword,
  ErrorHandlerService,
  paginationService,
} from "../services/index.js";
import { teacherValidationSchema } from "../services/validation-service.js";
import bcrypt from "bcrypt";

class TeacherController {
  async createTeacher(req, res, next) {
    try {
      const { error } = teacherValidationSchema.validate(req.body);
      if (error) {
        return next(error);
      }

      const isExist = await UserModel.findOne({ email: req.body.email });
      if (isExist) {
        return next(ErrorHandlerService.alreadyExist("Email already exists"));
      }

      const employeeNumber = generateRandomPassword();
      const password = generateRandomPassword();
      const hashedPassowrd = await bcrypt.hash(password, 10);

      const teacher = new UserModel({
        ...req.body,
        role: "Teacher",
        rollNumber: employeeNumber,
        password: hashedPassowrd,
      });
      await teacher.save();

      res.status(200).json({ teacher });
    } catch (error) {
      next(error);
    }
  }

  async getTeachers(req, res, next) {
    try {
      const { page, limit, skip } = paginationService(req);
      let totalPages;

      const regexQueryEmail = new RegExp(req.query.qEmail || "", "i");
      const regexQueryName = new RegExp(req.query.qName || "", "i");
      const regexQueryLastName = new RegExp(req.query.qLastName || "", "i");
      const filter = [
        { $or: [{ role: "Teacher" }] },
        { name: { $regex: regexQueryName } },
        { lastName: { $regex: regexQueryLastName } },
        { email: { $regex: regexQueryEmail } },
      ];

      const [teachers, totalRecords] = await Promise.all([
        UserModel.find({ $and: filter }, "-__v").skip(skip).limit(limit).exec(),
        UserModel.countDocuments({ $and: filter }),
      ]);

      totalPages = Math.ceil(totalRecords / limit);
      return res
        .status(200)
        .json({ teachers, page, limit, totalRecords, totalPages });
    } catch (error) {
      return next(error);
    }
  }

  async getTeacher(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await UserModel.findById(_id, "-__v");
      if (!document) {
        return next(ErrorHandlerService.notFound("Teacher not found"));
      }
      return res.status(200).json({ teacher: document });
    } catch (error) {
      next(error);
    }
  }

  async updateTeacher(req, res, next) {
    const { _id } = req.params;
    try {
      const { error } = teacherValidationSchema.validate(req.body);
      if (error) {
        return next(error);
      }

      const existingTeacher = await UserModel.findById(_id);
      if (!existingTeacher) {
        return next(ErrorHandlerService.notFound("Teacher not found"));
      }
      const isExist = await UserModel.findOne({
        email: req.body.email,
        _id: { $ne: _id },
      });
      if (isExist) {
        return next(ErrorHandlerService.alreadyExist("Email already exists"));
      }
      const document = await UserModel.findByIdAndUpdate(_id, req.body, {
        new: true,
      });

      if (existingTeacher.email !== req.body.email) {
        await TransactionModel.updateMany(
          { email: existingTeacher.email },
          { $set: { email: req.body.email } }
        );
      }

      return res.status(200).json({ teacher: document });
    } catch (error) {
      next(error);
    }
  }

  async deleteTeacher(req, res, next) {
    const { _id } = req.params;
    try {
      const existingTeacher = await UserModel.findById(_id);
      if (!existingTeacher) {
        return next(ErrorHandlerService.notFound("Teacher not found"));
      }
      const isIssued = await TransactionModel.findOne({
        userEmail: existingTeacher.email,
      });
      if (isIssued) {
        return next(
          ErrorHandlerService.validationError(
            "Teacher has issued a book. Return it first!"
          )
        );
      }

      await UserModel.findByIdAndDelete(_id);

      res.status(204).json({ message: "Teacher deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default new TeacherController();
