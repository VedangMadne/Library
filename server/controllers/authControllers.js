import BookModel from "../models/book-model.js";
import CategoryModel from "../models/category-model.js";
import UserModel from "../models/user-model.js";
import {
  ErrorHandlerService,
  tokenService,
} from "../services/index.js";
import {
  loginValidationSchema,
} from "../services/validation-service.js";
import bcrypt from "bcrypt";

class AuthController {
  async login(req, res, next) {
    const { email, password } = req.body;
    const { error } = loginValidationSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    let user;
    try {
      user = await UserModel.findOne({ email });
      if (!user) {
        return next(
          ErrorHandlerService.wrongCredentials("Invalid Credentials.")
        );
      }
    } catch (error) {
      next(error);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(ErrorHandlerService.wrongCredentials("Invalid Credentials."));
    }

    const { accessToken, refreshToken } = await tokenService.genrateTokens({
      _id: user._id,
      role: user.role,
    });

    try {
      const isExist = await tokenService.findRefreshToken({ user: user._id });
      if (isExist) {
        await tokenService.updateRefreshToken(
          { user: user._id },
          { token: refreshToken }
        );
      } else {
        await tokenService.saveRefreshToken({
          user: user._id,
          token: refreshToken,
        });
      }
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({ isAuth: true, user: user });
  }

  async refreshTokens(req, res, next) {
    const { refreshToken: refreshTokenFromCookie } = req.cookies;
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
    } catch (error) {
      return next(ErrorHandlerService.unAuthorized());
    }

    try {
      const token = await tokenService.findRefreshToken({
        user: userData._id,
        token: refreshTokenFromCookie,
      });
      if (!token) {
        return next(ErrorHandlerService.unAuthorized("No token found !"));
      }

      const userExist = await UserModel.findOne({ _id: userData._id });
      if (!userExist) {
        return next(ErrorHandlerService.unAuthorized("No user found!"));
      }

      const { refreshToken, accessToken } = await tokenService.genrateTokens({
        _id: userData._id,
        role: userData.role,
      });
      await tokenService.updateRefreshToken(
        { user: userData._id },
        { token: refreshToken }
      );
      res.cookie("accessToken", accessToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.status(200).json({
        user: userExist,
        isAuth: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return next(ErrorHandlerService.validationError());
    }

    try {
      const user = await UserModel.findOne({ _id: req.userData._id });
      if (!user) {
        return next(ErrorHandlerService.notFound());
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return next(
          ErrorHandlerService.wrongCredentials("Current password is wrong!")
        );
      }
      const hashedPassowrd = await bcrypt.hash(newPassword, 10);
      await UserModel.findByIdAndUpdate(user._id, { password: hashedPassowrd });

      return res.status(200).json({ msg: "Password Changed Successfully !" });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    const { refreshToken } = req.cookies;
    try {
      await tokenService.removeRefreshToken({ token: refreshToken });
    } catch (error) {
      return next(error);
    }
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.json({
      user: null,
      isAuth: false,
    });
  }

  async getUserDetails(req, res, next) {
    const userId = req.query.userId;
    try {
      const user = await UserModel.findOne({ _id: userId }).populate("batch");
      if (!user) {
        return next(ErrorHandlerService.notFound("User Not Found"));
      }
      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async getHomeData(req, res, next) {
    try {
      const [totalBooks, totalUsers, totalCategories] = await Promise.all([
        BookModel.countDocuments(),
        UserModel.countDocuments(),
        CategoryModel.countDocuments(),
      ]);
      return res.status(200).json({
        totalBooks,
        totalUsers,
        totalCategories,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default new AuthController();
