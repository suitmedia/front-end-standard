const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

app.use(express.static('cms'))
app.use(express.static('assets'))
app.use(bodyParser.json())





const readSection = () => {
  let section = fs.readFileSync('configs/sectionlist.js', "utf8").split('\n')

  section.shift()
  return (JSON.parse(section.join('\n')))
}

const readSectionAsString = () => {
  return fs.readFileSync('configs/sectionlist.js', "utf8")
}

const storeSection = newData => {
	const topBuffer = 'var sectionList = \n'
	let buffer = topBuffer + JSON.stringify(newData)
	
  fs.writeFileSync('configs/sectionlist.js', buffer, {encoding: 'utf8'})
}





app.get('/', (req, res) => {
	res.sendFile(path.join(`${__dirname}/cms/index.html`))
})

app.get('/sectionList', (req, res) => {
	const bufferObj = readSection()

	res.send(bufferObj)
})

app.post('/sectionAdd', (req, res) => {
	let newSection = req.body
	let bufferObj = readSection()

	newSection.id = Date.now()
	console.log(newSection)
	bufferObj.push(newSection)
	storeSection(bufferObj)
	res.send('ok')
})

app.post('/sectionDelete', (req, res) => {
	const id = req.body.id
	let buffer = readSection().filter( obj => {
		return !( obj.id === id )
	})
	
	storeSection(buffer)
	res.send('ok')
})

app.post('/sectionEdit', (req, res) => {
	const newData = req.body
	console.log(newData)
	let buffer = readSection().map( obj => {
		if (obj.id === newData.id) {
			return newData
		}
		else
			return obj
	})

	storeSection(buffer)
	res.send('ok')
})

app.listen(8080, () => {
	console.log('running on 8080')
})