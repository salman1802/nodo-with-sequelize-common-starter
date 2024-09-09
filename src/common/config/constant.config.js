require("dotenv").config();

/**
 * Get base url
 * @readonly
 */


module.exports.baseUrl = (path = null) => {
    let url = `${process.env.BASE_URL}:${process.env.PORT}`;
    if(process.env.ENV !== "production"){
        url = `${process.env.BASE_URL}:${process.env.PORT}`;
    }
    return url + (path ? `${path}` : "")
}

/**
 * Enum platform type
 * @readonly
 * @enum
 */
module.exports.PLATFORM = Object.freeze({
  ANDROID: "Android",
  IOS: "iOS",
});

module.exports.STRIPE_KEY =
  process.env.STRIPE_KEY || "sk_test_fnKNOaE4JdDYcMSsDlPMHg1G";
