import Joi from "joi";

export const postSchema = Joi.object({
  _id: Joi.allow(),
  title: Joi.string().min(1).max(50).required(),
  message: Joi.string().required(),
  owner: Joi.required().allow(),
  comments: Joi.array().items({
    _id: Joi.allow(),
    text: Joi.string().required(),
    owner: Joi.required().allow(),
    __v: Joi.allow(),
  }),
  images: Joi.allow(),
  tags: Joi.array().items(Joi.string()),
  likes: Joi.array().items(Joi.string().allow()),
  createdAt: Joi.date().allow(),
  __v: Joi.allow(),
});

export const userSchema = Joi.object({
  _id: Joi.allow(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")).required(),
  confirmPassword: Joi.ref(".password"),
  firstName: Joi.string().pattern(new RegExp("^[a-zA-Z]{1,20}$")).required(),
  lastName: Joi.string().pattern(new RegExp("^[a-zA-Z]{1,20}$")).required()
});
