import {
  GITHUB_TOKEN,
  GITHUB_USERNAME,
  NUMBER_OF_BOOKS_ALLOWED_TO_STUDENT,
  NUMBER_OF_BOOKS_ALLOWED_TO_TEACHER,
  NUMBER_OF_DAYS_OF_STUDENT,
  NUMBER_OF_DAYS_OF_TEACHER_OR_HOD,
} from "../config/index.js";
import { ROOT_PATH } from "../server.js";
import csv from "fast-csv";
import fs from "fs";
import os from "os";
import simpleGit from "simple-git";
import { BASE_URL } from "../config/index.js";
import BookModel from "../models/book-model.js";
import { FineModel, TransactionModel } from "../models/transaction-models.js";
import UserModel from "../models/user-model.js";
import {
  ErrorHandlerService,
  calculateFine,
  paginationService,
} from "../services/index.js";
import { issuedBookSchema } from "../services/validation-service.js";
import path from "path";
import { fileURLToPath } from "url";
import AlmirahModel from "../models/almirah-model.js";
import DivisionModel from "../models/division-model.js";
import CategoryModel from "../models/category-model.js";
import ClassModel from "../models/class-model.js";

const GITHUB_REPO = `https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/mongodb-backups.git`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TransactionController {
  async adminDashboardStats(req, res, next) {
    try {
      const currentDate = new Date();
      const [
        numberOfBorrowedBooks,
        numberOfAvailableBooks,
        numberOfTotalBooks,
        numberOfReturnedBooks,
      ] = await Promise.all([
        TransactionModel.countDocuments({
          isBorrowed: true,
        }),
        BookModel.countDocuments({ status: "Available" }),
        BookModel.countDocuments({}),
        TransactionModel.countDocuments({
          isBorrowed: false,
        }),
      ]);

      const statusCounts = {
        Issued: numberOfBorrowedBooks,
        Available: numberOfAvailableBooks,
        returned: numberOfReturnedBooks,
      };

      const last12MonthsData = {};
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];

      for (let i = 0; i < 12; i++) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        last12MonthsData[`${monthNames[month]} ${year}`] = 0;
        currentDate.setMonth(currentDate.getMonth() - 1);
      }

      const transactions12 = await TransactionModel.find({
        borrowDate: {
          $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          $lt: new Date(),
        },
      }).exec();

      transactions12.forEach((transaction) => {
        const year = transaction.borrowDate.getFullYear();
        const month = transaction.borrowDate.getMonth();
        const key = `${monthNames[month]} ${year}`;
        last12MonthsData[key] = (last12MonthsData[key] || 0) + 1;
      });

      return res.status(200).json({
        numberOfBorrowedBooks,
        numberOfAvailableBooks,
        numberOfTotalBooks,
        numberOfReturnedBooks,
        statusCounts,
        last12MonthsData,
      });
    } catch (error) {
      next(error);
    }
  }

  async issuedBook(req, res, next) {
    const { error } = issuedBookSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const user = await UserModel.findById(req.body.userID);
      if (!user) {
        return next(ErrorHandlerService.notFound("User Not Found"));
      }
      const book = await BookModel.findById(req.body.bookID);
      if (!book) {
        return next(ErrorHandlerService.notFound("Book Not Found"));
      }

      if (book.status === "Issued" || book.status === "Lost") {
        return next(
          ErrorHandlerService.badRequest(
            `${
              book.status === "Issued"
                ? "OOPS ! Book is already Issued"
                : "OOPS ! This book is lost!"
            }`
          )
        );
      }

      const currentDate = new Date();
      const dueDate = new Date(currentDate);
      dueDate.setDate(
        currentDate.getDate() +
          (user.role === "Student"
            ? NUMBER_OF_DAYS_OF_STUDENT
            : NUMBER_OF_DAYS_OF_TEACHER_OR_HOD)
      );

      const transaction = new TransactionModel({
        user: user._id,
        book: book._id,
        ISBN: book?.ISBN,
        userEmail: user?.email,
        rollNumber: user?.rollNumber,
        dueDate,
      });
      await transaction.save();
      book.status = "Issued";
      await book.save();
      return res.status(200).json({ msg: "Book Issued Successfully..!" });
    } catch (error) {
      next(error);
    }
  }

  async userInfo(req, res, next) {
    const { qEmail, qRollNumber } = req.query;
    let user;
    try {
      if (qRollNumber) {
        user = await UserModel.findOne(
          { rollNumber: qRollNumber },
          "-__v -password -batch "
        );
      }
      if (qEmail) {
        user = await UserModel.findOne(
          { email: qEmail },
          "-__v -password -batch "
        );
      }
      if (!user) {
        return next(ErrorHandlerService.notFound("User Not Found"));
      }
      const borrowedBooks = await TransactionModel.find(
        {
          user: user._id,
          isBorrowed: true,
        },
        "book borrowDate"
      ).populate("book", "ISBN title ");
      const numberOfBorrowedBooks = borrowedBooks.length;
      const maxBooksAllowed = {
        Student: NUMBER_OF_BOOKS_ALLOWED_TO_STUDENT,
        Teacher: NUMBER_OF_BOOKS_ALLOWED_TO_TEACHER,
      };
      let hasExceededLimit;
      if (user.role in maxBooksAllowed) {
        hasExceededLimit = numberOfBorrowedBooks >= maxBooksAllowed[user.role];
      } else {
        return next(
          ErrorHandlerService.forbidden("Not Allowed to borrow book")
        );
      }

      return res.status(200).json({
        user,
        borrowedBooks,
        numberOfBorrowedBooks,
        hasExceededLimit,
        maxBooksAllowed: maxBooksAllowed[user.role],
      });
    } catch (error) {
      next(error);
    }
  }

  async bookInfo(req, res, next) {
    const { qISBN } = req.query;
    try {
      const book = await BookModel.findOne(
        { ISBN: qISBN },
        "ISBN status title author"
      );
      if (!book) {
        return next(ErrorHandlerService.notFound("Book Not Found"));
      }

      return res.status(200).json({
        book,
      });
    } catch (error) {
      return next(error);
    }
  }

  async returnBook(req, res, next) {
    const { transactionID } = req.body;
    if (!transactionID) {
      return next(
        ErrorHandlerService.validationError("Transaction is required.")
      );
    }
    try {
      const transaction = await TransactionModel.findOne({
        _id: transactionID,
      });
      if (!transaction) {
        return next(ErrorHandlerService.notFound("Transaction not found"));
      }

      if (!transaction.isPaid && transaction.fine !== 0) {
        return next(ErrorHandlerService.badRequest("Please Pay Fine First"));
      }

      transaction.isBorrowed = false;
      transaction.returnedDate = new Date();
      await transaction.save();
      await BookModel.findByIdAndUpdate(transaction.book, {
        status: "Available",
      });

      return res.status(200).json({ msg: "Book returned Successfully.." });
    } catch (error) {
      return next(error);
    }
  }

  async payFine(req, res, next) {
    const { transactionID } = req.body;
    if (!transactionID) {
      return next(
        ErrorHandlerService.validationError("Transaction is required.")
      );
    }
    try {
      const transaction = await TransactionModel.findOne({
        _id: transactionID,
      });
      if (!transaction) {
        return next(ErrorHandlerService.notFound("Transaction not found"));
      }
      transaction.isPaid = true;
      await transaction.save();

      await FineModel.create({
        transaction: transactionID,
        fine: transaction.fine,
      });

      res.status(200).json({ msg: "Fine paid successfully." });
    } catch (error) {
      next(error);
    }
  }

  async getIssuedBooks(req, res, next) {
    const { page, limit, skip } = paginationService(req);
    const { rollNumber, email, ISBN } = req.query;

    const regexQueryRollNumber = new RegExp(rollNumber || "", "i");
    const regexQueryEmail = new RegExp(email || "", "i");
    const regexQueryISBN = new RegExp(ISBN || "", "i");

    const filter = {
      isBorrowed: true,
      ...(rollNumber && { rollNumber: { $regex: regexQueryRollNumber } }),
      ...(email && { userEmail: { $regex: regexQueryEmail } }),
      ...(ISBN && { ISBN: { $regex: regexQueryISBN } }),
    };

    let totalPages;
    try {
      const transactions = await TransactionModel.find(
        filter,
        "-createdAt -updatedAt"
      )
        .populate("user", "role name email rollNumber")
        .populate("book", "ISBN title author")
        .skip(skip)
        .limit(limit);
      const totalRecords = await TransactionModel.countDocuments(filter);
      totalPages = Math.ceil(totalRecords / limit);

      const transactionsWithFine = await Promise.all(
        transactions.map(async (transaction) => {
          const { fine } = calculateFine(transaction.dueDate, new Date());

          if (fine > 0 && transaction.fine !== fine) {
            await TransactionModel.findByIdAndUpdate(transaction._id, {
              fine: fine,
            });
          }
          return { ...transaction.toObject(), fine };
        })
      );

      return res
        .status(200)
        .json({ transactionsWithFine, page, limit, totalRecords, totalPages });
    } catch (error) {
      next(error);
    }
  }

  async getReturnedBooks(req, res, next) {
    const { page, limit, skip } = paginationService(req);
    let totalPages;
    try {
      const books = await TransactionModel.find({ isBorrowed: false })
        .populate("user", "role name lastName email rollNumber")
        .populate("book", "ISBN title author")
        .skip(skip)
        .limit(limit);
      const totalRecords = await TransactionModel.countDocuments({
        isBorrowed: false,
      });
      totalPages = Math.ceil(totalRecords / limit);
      return res
        .status(200)
        .json({ books, page, limit, totalRecords, totalPages });
    } catch (error) {
      next(error);
    }
  }

  async exportIssuedBooks(req, res, next) {
    try {
      const { qRollNumber } = req.query;

      const transactions = await TransactionModel.find({ isBorrowed: true })
        .populate("user", "role name lastName rollNumber email")
        .populate("book", "ISBN title")
        .lean();

      const filtered = qRollNumber
        ? transactions.filter((t) =>
            t.user?.rollNumber?.startsWith(qRollNumber)
          )
        : transactions;

      if (filtered?.length === 0) {
        return next(ErrorHandlerService.notFound());
      }

      const csvStream = csv.format({ headers: true });
      const filePath = `${ROOT_PATH}/public/files/export/issuedbooks.csv`;
      const writablestream = fs.createWriteStream(filePath);

      csvStream.pipe(writablestream);

      writablestream.on("finish", function () {
        res.json({
          downloadUrl: `${BASE_URL}/public/files/export/issuedbooks.csv`,
        });
      });

      filtered.forEach((t, index) => {
        const isStudent = t.user?.role === "Student";
        csvStream.write({
          SrNo: index + 1,
          ISBN: t.book?.ISBN || "-",
          "Book Title": t.book?.title || "-",
          "First Name": t.user?.name || "-",
          "Last Name": t.user?.lastName || "-",
          "Roll Number": isStudent ? t.user?.rollNumber || "-" : "-",
          Email: isStudent ? "-" : t.user?.email || "-",
          "Issued Date": new Date(t.borrowDate).toLocaleDateString(),
          "Due Date": new Date(t.dueDate).toLocaleDateString(),
          Fine: t.fine || 0,
          Returned: t.isBorrowed ? "No" : "Yes",
        });
      });

      csvStream.end();
      writablestream.end();
    } catch (err) {
      next(err);
    }
  }

  async backupAllData(req, res, next) {
    try {
      const timestamp = new Date().toISOString().slice(0, 10);
      const backupFolderName = `backup-${timestamp}`;
      const tempCloneDir = path.join(os.tmpdir(), `repo-clone-${Date.now()}`);
      const backupDataDir = path.join(tempCloneDir, backupFolderName);

      const git = simpleGit();
      await git.clone(GITHUB_REPO, tempCloneDir);

      fs.mkdirSync(backupDataDir, { recursive: true });

      const collections = [
        { name: "users", data: await UserModel.find({}).lean() },
        { name: "books", data: await BookModel.find({}).lean() },
        { name: "transactions", data: await TransactionModel.find({}).lean() },
        { name: "fines", data: await FineModel.find({}).lean() },
        { name: "almirahs", data: await AlmirahModel.find({}).lean() },
        { name: "categories", data: await CategoryModel.find({}).lean() },
        { name: "divisions", data: await DivisionModel.find({}).lean() },
        { name: "classes", data: await ClassModel.find({}).lean() },
      ];

      for (const { name, data } of collections) {
        fs.writeFileSync(
          path.join(backupDataDir, `${name}.json`),
          JSON.stringify(data, null, 2),
          "utf-8"
        );
      }

      const repoGit = simpleGit(tempCloneDir);
      await repoGit.addConfig("user.name", "Library Backup Bot");
      await repoGit.addConfig("user.email", "bot@basavraj1831.dev");
      await repoGit.add(".");
      await repoGit.commit(`Backup on ${timestamp}`);
      await repoGit.push("origin", "main");

      fs.rmSync(tempCloneDir, { recursive: true, force: true });

      res.json({
        message: `Backup saved as '${backupFolderName}' and pushed to gitHub.`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionController();
