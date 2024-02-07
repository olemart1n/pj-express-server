function sendResponse(req, res, next) {
    res.sendData = (data) => {
        res.json({ data: data, error: null });
    };

    res.sendError = (error) => {
        res.json({
            data: null,
            error: { detail: error.detail, code: error.code },
        });
    };

    next();
}

module.exports = sendResponse;
