const formidable = require('formidable')

module.exports = async (req, res, next) => {
    if (!req.is('multipart/form-data')) return next()

    const form = formidable({ multiples: true })

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err)
        }
        req.formdata = { fields, files }
        next()
    })
}
