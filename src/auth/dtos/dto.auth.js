import Joi from "joi";

export const registerDto = Joi.object().keys({
    firstname: Joi.string().required()
    .messages({
        "string.empty": "First Name Required"
    }),
    lastname: Joi.string().required()
    .messages({
        "string.empty": "Last Name Required",
    }),
    email: Joi.string().email().required()
    .messages({
        "string.empty": "Email Required",
        "string.email" : "Enter valid email"
    }),
    countrycode: Joi.string().required()
    .messages({
        "string.empty": "Country Code Required",
    }),
    mobilenumber: Joi.string().min(7).max(10).required()
    .messages({
        "string.empty": "Mobile Number Required",
        'string.min': `Mobile Number should have a minimum length of 7`,
        'string.max': `Mobile Number should have a maximum length of 10`,
    }),
    zipcode: Joi.string().min(5).max(6).required()
    .messages({
        "string.empty": "Zipcode Required",
        'string.min': `Zipcode should have a minimum length of 5`,
        'string.max': `Zipcode should have a maximum length of 6`,
    }),
    createpassword: Joi.string()
        .regex(/^(?=.{8,})(?=.*[A-Z]).*$/)
        .required()
        .messages({
           "string.empty" : "Create Password Required",
            "string.pattern.base": "Password does not meet the requirements",
        }),
        confirmpassword: Joi.string()
        .valid(Joi.ref('createpassword'))
        .required()
        .messages({
          "any.required": "Confirm Password Required",
          "any.only": "Create Password and Confirm Password should be the same",
        }),
      
    location: Joi.string().required().messages({
        "string.empty": "Location Required",
    }),
      lat: Joi.string().messages({
        "string.empty": "lat Required",
    }),
      long: Joi.string().messages({
        "string.empty": "long Required",
    }),
    termsAndPolicy: Joi.bool().optional(),
});

export const loginDto = Joi.object().keys({
    email: Joi.string().email().trim().required()
    .messages({
        "string.empty": "Email Required",
    }),
    password: Joi.string().required()
    .messages({
        "string.empty": "Password Required",
    }),
});


export const verifyEmailOtpDto = Joi.object().keys({
    email: Joi.string().email().trim().required()
    .messages({
        "string.empty": "Email Required",
    }),
    otp: Joi.number().required()
    .messages({
        "string.empty": "OTP Required",
    }),
})

export const editEmail = Joi.object().keys({
    email: Joi.string().email().trim().required()
    .messages({
        "string.empty": "Email Required",
    }),

})