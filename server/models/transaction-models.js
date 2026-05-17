import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    /* JUST FOR SEARCHING.... EASE */
    ISBN: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    /* BOOLEAN VALUE THAT INDICATE THAT BOOK IS BORROWED BY STUDENT OR RETURNED IT  */
    isBorrowed: {
      type: Boolean,
      default: true,
    },
    /* DATES */
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    returnedDate: {
      type: Date,
    },

    fine: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);



const fineSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  fine: {
    type: Number,
    required: true,
  },
  paidDate: {
    type: Date,
    default: Date.now,
  },
});

const TransactionModel = mongoose.model("Transaction", transactionSchema);
const FineModel = mongoose.model("Fine", fineSchema);

export { TransactionModel, FineModel };
