const DoctorStore = require("../models/doctor");
const { successRes, errorRes } = require("../services/response");
const validator = require("validator");

const store = new DoctorStore();

const index = async (_req, res, next) => {
  try {
    if (!res.data)
      return res.status(200).json(successRes(200, null, "Nothing exits"));
    const newData = res.data.map((res) => {
      const { working_schedule, ...doctor } = res;
      if (working_schedule)
        doctor.working_schedule = Object.values(working_schedule);
      return doctor;
    });
    res
      .status(200)
      .json(
        successRes(
          200,
          newData,
          "Doctor's fetched successfully",
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

const showDoctorProfile = async (req, res, next) => {
  try {
    const { working_schedule, ...doctor } = await store.showDoctorProfile(
      req.userId
    );
    doctor.working_schedule = Object.values(working_schedule);
    res
      .status(200)
      .json(successRes(200, doctor, "Profile fetched successfully"));
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
  const doctor = {
    full_name: req.body.full_name,
    phone: req.body.phone,
    clinic_location: req.body.clinic_location,
    working_schedule: req.body.working_schedule,
    clinic_phone_number: req.body.clinic_phone_number,
  };
  try {
    if (doctor.email && !validator.isEmail(doctor.email))
      throw new Error("email address is not valid ");
    if (doctor.image && !validator.isURL(doctor.image, []))
      throw new Error("image path is not valid");
    if (
      doctor.phone &&
      !/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(doctor.phone)
    )
      throw new Error("phone number is not valid");

    if (req.files) {
      if (req.files.profile_image) {
        let path = [];
        req.files.profile_image.map((file) => {
          path.push(`${file.path}`);
        });
        doctor.profile_image = path[0];
      }
      if (req.files.certificate_image) {
        let path = [];
        req.files.certificate_image.map((file) => {
          path.push(`${file.path}`);
        });
        doctor.certificate_image = path[0];
      }
    }
    await store.update(doctor, req.userId);
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

const showParentsBelongsToDoctor = async (req, res, next) => {
  try {
    const parents = await store.showParentsBelongsToDoctor(req.userId);
    res
      .status(200)
      .json(successRes(200, parents, "Parent's fetched successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const addParentToDoctor = async (req, res, next) => {
  try {
    const isAdded = await store.checkIfParentIsAdded(req.body.parent_email);
    if (isAdded)
      res.status(400).json(errorRes(400, "Parent is already added."));
    else {
      await store.addParentToDoctor(req.userId, req.body.parent_email);
      res.status(200).json(successRes(200, null, "Parent added successfully."));
    }
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const removeParentBelongsToDoctor = async (req, res, next) => {
  try {
    await store.removeParentBelongsToDoctor(req.userId, req.body.parent_email);
    res.status(200).json(successRes(200, null, "Parent added successfully."));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const getDoctorRatings = async (req, res, next) => {
  try {
    const parents = await store.getDoctorRatings(req.params.doctor_id);
    res
      .status(200)
      .json(successRes(200, parents, "Rating's fetched successfully"));
  } catch (error) {
    if (error.code)
      return res.status(error.code).json(errorRes(error.code, error.message));
    if (error.message) {
      return res.status(400).json(errorRes(400, error.message));
    }
    next(error);
  }
};

const getPrivatePosts = async (req, res, next) => {
  try {
    const parents = await store.getPrivatePosts(req.params.doctor_id);
    res
      .status(200)
      .json(successRes(200, parents, "Posts's fetched successfully"));
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
  update,
  remove,
  showDoctorProfile,
  showParentsBelongsToDoctor,
  addParentToDoctor,
  removeParentBelongsToDoctor,
  getDoctorRatings,
  getPrivatePosts,
};
