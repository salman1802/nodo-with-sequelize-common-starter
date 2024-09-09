import Joi from "joi"

export const forgot = Joi.object().keys({
    email: Joi.string().email().trim().required()
    .messages({
        "string.empty": "Email Required",
        "string.email" : "Enter valid email"
    }),

})


export const editProfile = Joi.object().keys({
    firstname: Joi.string().optional() .messages({
      
        "string.empty" : "First Name Required"
    }),
    lastname: Joi.string().optional() .messages({
      
        "string.empty" : "Last Name Required"
    }),
    email: Joi.string().email().optional()
    .messages({
        "string.empty" : "Email Required",
        "string.email" : "Enter valid email"
    }),
    countrycode: Joi.string().optional() .messages({
      
        "string.empty" : "Country Code required"
    }),
    mobilenumber: Joi.string().min(7).max(10).messages({
        "string.empty" : "Mobile Number required",
        'string.min': `Mobile Number should have a minimum length of 7`,
        'string.max': `Mobile Number should have a maximum length of 10`,
    }),
    zipcode: Joi.string().min(5).max(6).optional()
    .messages({
        "string.empty": "Zipcode Required",
        'string.min': `Zipcode should have a minimum length of 5`,
        'string.max': `Zipcode should have a maximum length of 6`,
    }),
  
      
    location: Joi.string().optional() .messages({
      
        "string.empty" : "Location Required"
    }),
    lat: Joi.string().when("location", {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
    }),
    long: Joi.string().when("location", {  
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
    }),
   
 
});