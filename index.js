const fs = require('fs').promises
const path = require('path')
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const fileParser = require('./file-parser')

const app = express()

// this would be in an env var
const API_URL = 'http://localhost:5000'

const isImage = (file) => file.type.split('/')[0] === 'image'

const getFileExtension = (file) => file.name.split('.').pop()

app.post('/avatar', fileParser, async (req, res, next) => {
    try {
        if (!req.formdata || !req.formdata.files || !req.formdata.files.avatar) {
            return res.status(400).send({ errors: ['missing avatar file'] })
        }

        const file = req.formdata.files.avatar
        if (!isImage(file)) {
            return res.status(400).send({ errors: ['invalid image type'] })
        }

        const extension = getFileExtension(file)
        const fileName = `avatar-${uuidv4()}.${extension}`
        const newPath = path.join(__dirname, `media/${fileName}`)

        await fs.copyFile(file.path, newPath)
        await fs.unlink(file.path)

        return res.status(200).send({ url: `${API_URL}/media/${fileName}` })
    } catch (err) {
        next(err)
    }
})

app.use('/media', express.static('media'))

app.use((err, req, res, next) => res.status(500).json({ message: 'internal error' }))

app.listen(5000, () => console.log('listening'))