const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

app.use(express.static('cms'))
app.use(express.static('assets'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.sendFile(path.join(`${__dirname}/cms/index.html`))
})

app.get('/sectionList', (req, res) => {
	const buffer = fs.readFileSync('configs/sectionlist.js', "utf8").split('\n')
	let newBuffer = buffer
										.map( (current, index, arr) => {
											if( index !== 0 && index !== arr.length - 1  ) {
												return current
											} else {
												return ''
											}
										})
										.join('\n')
										.replace(/\s/g, '')
	newBuffer = `[ ${newBuffer} ]`
	res.send(newBuffer)
})

app.post('/sectionAdd', (req, res) => {
	const buffer = fs.readFileSync('configs/sectionlist.js', "utf8").split('\n')
	const topBuffer = buffer[0]
	const bottomBuffer = '\n' + buffer[buffer.length - 1]
	const midBuffer = buffer
										.map( (current, index, arr) => {
											if( index !== 0 && index !== arr.length - 1 ) {
												return current
											} else {
												return ''
											}
										})
										.concat(', ')
										.concat(JSON.stringify(req.body))
										.join('\n')
	const newBuffer = topBuffer + midBuffer + bottomBuffer

	fs.writeFileSync('configs/sectionlist.js', newBuffer, {
    encoding: 'utf8'
  })

	res.send('ok')
})

app.listen(8080, () => {
	console.log('running on 8080')
})