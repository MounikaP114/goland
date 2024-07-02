import User from "../models/user-model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import Property from "../models/property-model.js";

export const user = (req, res) => {
  res.json({
    msg: "hello dear",
  });
};
export const updateUserInfo = async (req, res, next) => {
  console.log(req.user.id, req.params.id);
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "login with your account"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUserInfo = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(
      errorHandler(401, " You  can only able to  delete  your own account")
    );
  await User.findByIdAndDelete(req.params.id);
  res.clearCookie("access_token");
  res.status(200).json("User account deleted successfully");
};

export const getUserListProperties = async (req, res, next) => {
  // console.log(req.user.id, req.params.id);
  if (req.user.id === req.params.id) {
    try {
      const data = await Property.find({ userRef: req.params.id });

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view Own Propeties list"));
  }
};
export const getUser = async (req, res, next) => {
  try {
    const data = await User.findById(req.params.id);

    if (!data) return next(errorHandler(404, "User Not Found"));

    const { password: pass, ...rest } = data._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
export const getUsers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 1;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const offer = req.query.offer;
    if (offer === "undefined" || offer === "false") {
      offer = { $in: ["true", "false"] };
    }

    const furnished = req.query.furnished;
    if (furnished === "undefined" || furnished === "false") {
      furnished = { $in: ["false", "true"] };
    }
    const parking = req.query.parking;
    if (parking === "undefined" || furnished === "false") {
      parking = { $in: ["false", "true"] };
    }

    const type = req.query.type;
    if (type === "undefined" || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const search = await Property.find({
      name: { $regrex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(search);
  } catch (error) {
    next(error);
  }
};
