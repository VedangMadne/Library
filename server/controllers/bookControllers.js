import AlmirahModel from "../models/almirah-model.js";
import BookModel from "../models/book-model.js";
import { TransactionModel } from "../models/transaction-models.js";
import { ErrorHandlerService, paginationService } from "../services/index.js";
import { bookValidationSchema } from "../services/validation-service.js";
import { v2 as cloudinary } from "cloudinary";

class BookController {
  async createBook(req, res, next) {
    const { error } = bookValidationSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    let image = "";
    try {
      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        image = uploadResult.secure_url;
      }

      const isIssued = await BookModel.findOne({ ISBN: req.body.ISBN });
      if (isIssued) {
        return next(ErrorHandlerService.validationError("ISBN already exists"));
      }

      const book = new BookModel({
        ...req.body,
        imagePath: image,
      });

      await book.save();

      await AlmirahModel.findByIdAndUpdate(
        req.body.almirah,
        { $inc: { bookCount: 1 } },
        { new: true }
      );

      return res.status(200).json({ book });
    } catch (error) {
      next(error);
    }
  }

  async getBooks(req, res, next) {
    const { page, limit, skip } = paginationService(req);
    const { qISBN = "", qTitle = "", qStatus, qCategory, qAlmirah } = req.query;
    const regexQueryISBN = new RegExp(qISBN, "i");
    const regexQueryTitle = new RegExp(qTitle, "i");

    const filter = [
      { ISBN: { $regex: regexQueryISBN } },
      { title: { $regex: regexQueryTitle } },
    ];
    if (qCategory) {
      filter.push({ category: qCategory });
    }
    if (qAlmirah) {
      filter.push({ almirah: qAlmirah });
    }
    if (qStatus) {
      filter.push({ status: qStatus });
    }

    try {
      const [books, totalRecords] = await Promise.all([
        BookModel.find({ $and: filter }, "-__v")
          .populate("category", "-__v")
          .populate("almirah", "-__v")
          .skip(skip)
          .limit(limit)
          .exec(),
        BookModel.countDocuments({ $and: filter }).exec(),
      ]);
      const totalPages = Math.ceil(totalRecords / limit);
      return res
        .status(200)
        .json({ books, page, limit, totalRecords, totalPages });
    } catch (error) {
      next(error);
    }
  }

  async getBook(req, res, next) {
    const { _id } = req.params;
    try {
      const document = await BookModel.findById(_id, "-__v")
        .populate("category")
        .populate("almirah");
      if (!document) {
        return next(ErrorHandlerService.notFound());
      }
      return res.status(200).json(document);
    } catch (error) {
      next(error);
    }
  }

  async updateBook(req, res, next) {
    const { error } = bookValidationSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { _id } = req.params;
    let image = "";

    try {
      const duplicateISBN = await BookModel.findOne({
        ISBN: req.body.ISBN,
        _id: { $ne: _id },
      });
      if (duplicateISBN) {
        return next(ErrorHandlerService.validationError("ISBN already exists"));
      }

      const existingBook = await BookModel.findById(_id);
      if (!existingBook) {
        return next(ErrorHandlerService.notFound("Book not found"));
      }

      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        image = uploadResult.secure_url;
      }
       else {
        image = existingBook.imagePath;
      }

      if (
        req.body.almirah &&
        req.body.almirah !== existingBook.almirah.toString()
      ) {
        await AlmirahModel.findByIdAndUpdate(existingBook.almirah, {
          $inc: { bookCount: -1 },
        });

        await AlmirahModel.findByIdAndUpdate(req.body.almirah, {
          $inc: { bookCount: 1 },
        });
      }

      if (req.body.ISBN !== existingBook.ISBN) {
        await TransactionModel.updateMany(
          { ISBN: existingBook.ISBN },
          { $set: { ISBN: req.body.ISBN } }
        );
      }

      await BookModel.findByIdAndUpdate(
        _id,
        { ...req.body, imagePath: image },
        { new: true }
      );

      return res.status(200).json({ msg: "Book updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async deleteBook(req, res, next) {
    const { _id } = req.params;
    try {
      const existingBook = await BookModel.findById(_id);
      if (!existingBook) {
        return next(ErrorHandlerService.notFound("Book Not Found"));
      }
      const isIssued = await TransactionModel.findOne({
        ISBN: existingBook.ISBN,
      });
      if (isIssued) {
        return next(
          ErrorHandlerService.validationError(
            "Book already issued. Please return it first.!"
          )
        );
      }
      await AlmirahModel.findByIdAndUpdate(
        existingBook.almirah,
        { $inc: { bookCount: -1 } },
        { new: true }
      );
      await BookModel.findByIdAndDelete(_id);

      return res.status(200).json({ message: "Book Deleted Successfull" });
    } catch (error) {
      next(error);
    }
  }
}

export default new BookController();
