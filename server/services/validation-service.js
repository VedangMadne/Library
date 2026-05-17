import Joi from "joi";

/* DEFINE CUSTOM MESSAGES */
const customErrorMessages = {
  "any.required": "{{#label}} is required.",
  "number.base": "{{#label}} must be a number.",
  "number.integer": "{{#label}} must be an integer.",
  "number.min": "{{#label}} should not be less than {{#limit}}.",
  "number.max": "{{#label}} should not be greater than {{#limit}}.",
  "string.pattern.base":
    "{{#label}} should contain alphabetic characters only.",
};

/* BOOK VALIDATION SCHEMA */

const bookValidationSchema = Joi.object({
  ISBN: Joi.string().required().max(10),
  title: Joi.string().required().max(200),
  author: Joi.string().required().max(60),
  category: Joi.string().required(),
  almirah: Joi.string().required(),
  shelf: Joi.string().optional(),
  publisher: Joi.string().optional(),
  edition: Joi.string().optional(),
  description: Joi.string().optional().empty(),
  tags: Joi.string().optional(),
  status: Joi.string().optional(),
  image: Joi.string().optional(),
});

/* EBOOK VALIDATION SCHEMA  */

const eBookValidationSchema = Joi.object({
  ISBN: Joi.string().required().max(10),
  title: Joi.string().required().max(50),
  author: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/),
  category: Joi.string().required(),
  publisher: Joi.string().optional(),
  edition: Joi.string().optional(),
  description: Joi.string().optional(),
  tags: Joi.string().optional(),
});

/* TEACHER VALIDATION SCHEMA */
const teacherValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/),
  middleName: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/),
  lastName: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/),
  email: Joi.string().required().email(),
}).messages(customErrorMessages);

const contactUsValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/),
  email: Joi.string().required().email(),
  message: Joi.string().required(),
}).messages(customErrorMessages);

/* STUDENT VALIDATION SCHEMA */
const studentValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/),
  middleName: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/),
  lastName: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/),
  rollNumber: Joi.string().required(),
  class: Joi.string().required(),
  division: Joi.string().required(),
  accountStatus: Joi.boolean().optional(),
}).messages(customErrorMessages);

const issuedBookSchema = Joi.object({
  userID: Joi.string().required(),
  bookID: Joi.string().required(),
});

const renewBookSchema = Joi.object({
  transactionID: Joi.string().required(),
  renewalDays: Joi.number().min(1).max(7).required(),
});

const renewHandleSchema = Joi.object({
  transactionID: Joi.string().required(),
  renewalStatus: Joi.string().valid("Accepted", "Rejected").required(),
});

/* CATEGORY VALIDATION SCEHMA */
const categoryValidationSchema = Joi.object({
  name: Joi.string().required().max(30),
  description: Joi.string().allow("", null).optional(),
}).messages(customErrorMessages);

/* ALMIRAH VALIDATION SCEHMA */
const almirahValidationSchema = Joi.object({
  subject: Joi.string().required().max(20),
  number: Joi.string().required(),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
}).messages(customErrorMessages);

const forgetPasswordValidationSchema = Joi.object({
  email: Joi.string().required().email(),
}).messages(customErrorMessages);

const departementValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/),
  hod: Joi.string().required(),
}).messages(customErrorMessages);

const batchValidationSchema = Joi.object({
  startingYear: Joi.string()
    .trim()
    .length(4)
    .pattern(/^\d{4}$/)
    .required()
    .label("Starting Year"),
}).messages({
  "string.empty": `"Starting Year" is required`,
  "string.length": `"Starting Year" must be exactly 4 digits`,
  "string.pattern.base": `"Starting Year" must be a valid 4-digit year`,
});

export {
  batchValidationSchema,
  teacherValidationSchema,
  loginValidationSchema,
  forgetPasswordValidationSchema,
  departementValidationSchema,
  studentValidationSchema,
  categoryValidationSchema,
  almirahValidationSchema,
  bookValidationSchema,
  eBookValidationSchema,
  issuedBookSchema,
  contactUsValidationSchema,
  renewBookSchema,
  renewHandleSchema,
};
