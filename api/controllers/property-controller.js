import Property from "../models/property-model.js";
import { errorHandler } from "../utils/error.js";

export const createProperty = async (req, res, next) => {
  try {
    const propertylist = await Property.create(req.body);
    return res.status(201).json(propertylist);
  } catch (error) {
    next(error);
  }
};
export const deleteProperty = async (req, res, next) => {
  const propertyExsist = await Property.findById(req.params.id);
  // console.log(req.params.id);
  if (!propertyExsist) return next(errorHandler(404, "Property Not  Found"));

  if (req.user.id !== propertyExsist.userRef)
    return next(errorHandler(401, " you can only delete you own propertylist"));
  try {
    await Property.findByIdAndDelete(req.params.id);
    return res.status(200).json("deleted successfully");
  } catch (error) {
    next(error);
  }
};
export const updateProperty = async (req, res, next) => {
  const list = await Property.findById(req.params.id);
  if (!list) return next(errorHandler(404, "No Proerties Found"));

  if (req.user.id !== list.userRef)
    return next(errorHandler(401, " You Can Only Update Your Own Properties"));
  try {
    const updatedata = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedata);
  } catch (error) {
    next(error);
  }
};
export const getProperty = async (req, res, next) => {
  try {
    const info = await Property.findById(req.params.id);
    if (!info) {
      return next(errorHandler(404, "Property not found"));
    }
    await res.status(200).json(info);
  } catch (error) {
    next(error);
  }
};
export const getPropertys = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const offer =
      req.query.offer === "true"
        ? true
        : req.query.offer === "false"
        ? false
        : { $in: [false, true] };
    const furnished =
      req.query.furnished === "true"
        ? true
        : req.query.furnished === "false"
        ? false
        : { $in: [false, true] };
    const parking =
      req.query.parking === "true"
        ? true
        : req.query.parking === "false"
        ? false
        : { $in: [false, true] };
    const type =
      req.query.type === "sale" || req.query.type === "rent"
        ? req.query.type
        : { $in: ["sale", "rent"] };
    const searchTerm = req.query.searchTerm ? req.query.searchTerm : "";
    const sort = req.query.sort || "createdAt";

    const order = req.query.order === "asc" ? "asc" : "desc";

    const listings = await Property.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
