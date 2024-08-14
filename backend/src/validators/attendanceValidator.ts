import Joi from 'joi';

export const createAttendanceValidator = Joi.object({
    name: Joi.string().required(),
    majorIds: Joi.array().items(Joi.string().required()).required(),
    groupIds: Joi.array().items(Joi.string().required()).required(),
    teacherId: Joi.string().required(),
    subjectId: Joi.string().required(),
    studentIds: Joi.array().items(Joi.string()),
    startDate: Joi.string().isoDate().required(),
    endDate: Joi.string().isoDate().allow(null),
});

export const updateAttendanceValidator = Joi.object({
    name: Joi.string(),
    majorIds: Joi.array().items(Joi.string()),
    groupIds: Joi.array().items(Joi.string()),
    teacherId: Joi.string(),
    subjectId: Joi.string(),
    studentIds: Joi.array().items(Joi.string()),
    startDate: Joi.string().isoDate(),
    endDate: Joi.string().isoDate().allow(null),
});

// Updated validator to include both attendanceId and studentId
export const addStudentToAttendanceValidator = Joi.object({
    // These will be provided as URL parameters, not in the request body
    attendanceId: Joi.string().required(),
    studentId: Joi.string().required(),
});

export const endAttendanceValidator = Joi.object({
    // These will be provided as URL parameters, not in the request body
    attendanceId: Joi.string().required(),
})