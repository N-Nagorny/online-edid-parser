// External dependencies
const bodyParser = require('body-parser')
const express = require('express')
const edidParser = require('edid-parser')
const path = require('path')

// Constants
const PORT = process.env.PORT || 8081
const HOST = '0.0.0.0'
const public_dir = path.join(__dirname, 'public')

// Express App
const app = express()
const frontend = express()
app.use(express.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.use((err, req, res, next) => {
  // format error
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  })
})

frontend.use('/public', express.static(public_dir))
console.log("Serving ", public_dir)
frontend.set('view engine', 'pug')
frontend.set('view options', { layout: false })

app.use(['/'], frontend)

frontend.get('/', function (req, res, next) {
  if (req.query.edid) {
    const hexStringToUint8Array = (hexString) =>
      Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

    let edidStr = req.query.edid
    let parsedEdid = edidParser.parseEdidBinary(hexStringToUint8Array(edidStr))
    let edidBlocks = edidStr.match(/.{1,256}/g) // one block is 128 bytes, one byte is two hex characters

    let edidBlocksShortLines = edidBlocks.map(edidBlock =>
      edidBlock
        .match(/.{1,32}/g) // one line is 16 bytes
        .map(edidShortLine =>
          edidShortLine
            .match(/.{1,2}/g)
            .map(currentValue =>
              '0x' + currentValue
            )
            .join(", ")
        )
    )

    let beautifiedInput =
      edidBlocksShortLines
        .map(edidBlock =>
          edidBlock.join(',\n')
        )
        .join(',\n\n')

    res.render('index', {
      title: "Home",
      inputValue: beautifiedInput,
      outputValue: parsedEdid
    })
  } else {
    res.render('index', {
      title: "Home"
    })
  }
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
