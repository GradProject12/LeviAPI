const ParentStore = require("../models/parent");
const { successRes, errorRes } = require("../services/response");
const validator = require("validator");

const store = new ParentStore();

const index = async (_req, res, next) => {
  try {
    if (!res.data)
      return res.status(200).json(successRes(200, null, "Nothing exits"));
    res
      .status(200)
      .json(
        successRes(
          200,
          res.data,
          "Parents's fetched successfully",
          res.paginatedResult
        )
      );
  } catch (error) {
    if (error.code)
      return res
        .status(error.code)
        .json(errorRes(error.code, error.message, null));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message, null));
    }
    next(error);
  }
};

const showParent = async (req, res, next) => {
  try {
    const parent = await store.showParent(req.userId);
    const { user_id, password, verified, secret, ...rest } = parent;
    res.status(200).json(successRes(200, rest, "Parent fetched successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const update = async (req, res, next) => {
  const parent = {
    full_name: req.body.full_name,
    phone: req.body.phone,
  };
  try {
    if (parent.password && parent.password.length < 8)
      throw new Error("password must be at least 8 characters ");
    if (parent.profile_image && !validator.isURL(parent.profile_image, []))
      throw new Error("image path is not valid");

    if (req.files) {
      if (req.files.profile_image) {
        let path = [];
        req.files.profile_image.map((file) => {
          path.push(`${file.path}`);
        });
        parent.profile_image = path[0];
      }
    }
    await store.update(parent, req.userId);
    res
      .status(200)
      .json(successRes(200, null, "Account is updated successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await store.delete(req.userId);
    res
      .status(200)
      .json(successRes(200, null, "Account is removed successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const showParentAnalayses = async (req, res, next) => {
  try {
    console.log(req.params.parent_id);
    const analyses = await store.showParentAnalayses(req.params.parent_id);
    res
      .status(200)
      .json(successRes(200, analyses, "Analyses fetched successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const showDoctor = async (req, res, next) => {
  const { doctor_id } = req.params;
  try {
    const { rows, rating_average, reviews_number, rated } =
      await store.showDoctor(doctor_id, req.userId);
    const { working_schedule, ...doctor } = rows[0];
    doctor.working_schedule = Object.values(working_schedule);
    res
      .status(200)
      .json(
        successRes(
          200,
          { doctor, rating_average, reviews_number, rated },
          "Doctor fetched successfully"
        )
      );
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const rateDoctor = async (req, res, next) => {
  const params = {
    doctor_id: req.body.doctor_id,
    parent_id: req.userId,
    rating: +req.body.rating,
    review: req.body.review,
  };
  try {
    if (params.rating > 10 || params.rating < 0)
      throw new Error("Please enter rating value in range (0-10)");
    await store.rateDoctor(params);
    res
      .status(200)
      .json(successRes(200, null, "Doctor is rated Successfully."));
  } catch (error) {
    if (error.code) {
      return res.status(401).json(errorRes(401, error.message));
    }
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const showParentInfo = async (req, res, next) => {
  try {
    const parent = await store.showParentInfo(req.userId);
    const doctor = parent.doctor ? parent.doctor[0] : undefined;
    if (doctor) {
      doctor.working_schedule = Object.values(doctor.working_schedule);
    }
    res
      .status(200)
      .json(
        successRes(
          200,
          { ...parent.parent[0], doctor },
          "Profile fetched successfully"
        )
      );
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const getMyDoctorsInfo = async (req, res, next) => {
  try {
    const doctor = await store.getMyDoctorsInfo(req.userId);
    res
      .status(200)
      .json(successRes(200, doctor, "Doctor fetched successfully."));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

module.exports = {
  index,
  showParent,
  update,
  remove,
  showParentAnalayses,
  showDoctor,
  rateDoctor,
  showParentInfo,
  getMyDoctorsInfo,
};
