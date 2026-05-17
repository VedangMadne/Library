import UserModel from "../models/user-model.js";
import {
  ErrorHandlerService,
  generateRandomPassword,
  paginationService,
} from "../services/index.js"
import { studentValidationSchema } from "../services/validation-service.js";
import bcrypt from "bcrypt";
import { TransactionModel } from "../models/transaction-models.js";
import ClassModel from "../models/class-model.js";
import DivisionModel from "../models/division-model.js";

class StudentController {
  async createStudent(req, res, next) {
    const { error } = studentValidationSchema.validate(req.body);
    console.log(req.body);
    if (error) {
      return next(error);
    }

    try {
      const classId = await ClassModel.findById(req.body.class);
      if (!classId) {
        return next(ErrorHandlerService.notFound("Class not found"));
      }

      const divisionId = await DivisionModel.findById(req.body.division);
      if (!divisionId) {
        return next(ErrorHandlerService.notFound("Division not found"));
      }

      const formattedRollNumber = `${classId.class}${divisionId.name}-${req.body.rollNumber}`;
      const email = `${formattedRollNumber}@student.com`;

      const password = generateRandomPassword();
      const hashedPassowrd = await bcrypt.hash(password, 10);

      const isRollNumberExist = await UserModel.findOne({
        rollNumber: formattedRollNumber,
      });

      if (isRollNumberExist) {
        return next(
          ErrorHandlerService.alreadyExist("Roll number already exists")
        );
      }

      const student = new UserModel({
        ...req.body,
        role: "Student",
        rollNumber: formattedRollNumber,
        email,
        password: hashedPassowrd,
      });

      await student.save();

      res.status(200).json({ student });
    } catch (error) {
      return next(error);
    }
  }

  async getStudents(req, res, next) {
    const { page, limit, skip } = paginationService(req);
    let totalPages;

    const regexQueryName = new RegExp(req.query.qName || "", "i");
    const regexQueryLastName = new RegExp(req.query.qLastName || "", "i");
    const regexQueryRollNumber = new RegExp(req.query.qRollNumber || "", "i");

    const filter = [
      { role: "Student" },
      { name: { $regex: regexQueryName } },
      { lastName: { $regex: regexQueryLastName } },
      { rollNumber: { $regex: regexQueryRollNumber } },
    ];

    try {
      const [students, totalRecords, classes, divisions] = await Promise.all([
        UserModel.find({ $and: filter }, "-__v")
          .sort({ createdAt: -1 })
          .populate("class", "-__v")
          .populate("division", "-__v")
          .skip(skip)
          .limit(limit)
          .exec(),
        UserModel.countDocuments({ $and: filter }).exec(),
        ClassModel.find(),
        DivisionModel.find(),
      ]);
      totalPages = Math.ceil(totalRecords / limit);
      return res.status(200).json({
        students,
        page,
        limit,
        totalRecords,
        totalPages,
        classes,
        divisions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudent(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await UserModel.findById(_id, "-__v").populate(
        "class",
        "-__v"
      );
      if (!document) {
        return next(ErrorHandlerService.notFound("Student not found"));
      }
      return res.status(200).json({ student: document });
    } catch (error) {
      next(error);
    }
  }

  async updateStudent(req, res, next) {
    const { _id } = req.params;
    try {
      const { error } = studentValidationSchema.validate(req.body);
      if (error) {
        return next(error);
      }

      const existingStudent = await UserModel.findById(_id);
      if (!existingStudent) {
        return next(ErrorHandlerService.notFound("Student not found"));
      }

     const classId = await ClassModel.findById(req.body.class);
     if (!classId) {
       return next(ErrorHandlerService.notFound("Class not found"));
     }

     const divisionId = await DivisionModel.findById(req.body.division);
     if (!divisionId) {
       return next(ErrorHandlerService.notFound("Division not found"));
     }

     const formattedRollNumber = `${classId.class}${divisionId.name}-${req.body.rollNumber}`;

      const isRollNumberExist = await UserModel.findOne({
        rollNumber: formattedRollNumber,
        _id: { $ne: _id },
      });

      if (isRollNumberExist) {
        return next(
          ErrorHandlerService.alreadyExist("Roll number already exists")
        );
      }

      const updatedStudentData = {
        ...req.body,
        rollNumber: formattedRollNumber,
      };

      const document = await UserModel.findByIdAndUpdate(
        _id,
        updatedStudentData,
        {
          new: true,
        }
      );

       if (existingStudent.rollNumber !== formattedRollNumber) {
         await TransactionModel.updateMany(
           { rollNumber: existingStudent.rollNumber },
           { $set: { rollNumber: formattedRollNumber } }
         );
       }

      return res.status(200).json({ student: document });
    } catch (error) {
      next(error);
    }
  }

  async deleteStudent(req, res, next) {
    const { _id } = req.params;
    try {
      const existingStudent = await UserModel.findById(_id);
      if (!existingStudent) {
        return next(ErrorHandlerService.notFound("Student not found"));
      }
      const isIssued = await TransactionModel.findOne({
        rollNumber: existingStudent.rollNumber,
      });
      if (isIssued) {
        return next(
          ErrorHandlerService.validationError(
            "Student has issued a book. Return it first!"
          )
        );
      }

      await UserModel.findByIdAndDelete(_id);
     
      res.status(204).json({ message: "Student deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default new StudentController();
