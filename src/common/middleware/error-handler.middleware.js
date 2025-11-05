export default (err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        if (err.statusCode == 500) {
            if (process.env.IS_SECURE == "false") {
                return res.status(500).json({
                    status: "error",
                    message: err.error.details[0].message,
                });
            } else if (process.env.IS_SECURE == "true") {
                return res.status(500).json({
                    status: "error",
                    message: "Server error",
                });
            }
        }
        return res.status(422).json({
            status: "error",
            message: err.error.details[0].message,
        });
    }
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    } else {
        return res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};
