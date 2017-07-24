const express = require('express')
const path = require('path')
const opn = require('opn')
const bodyParser = require('body-parser')
const db = require('./cms/db.js')
const app = express()
const port = 5000

app.use(express.static('cms'))
app.use(express.static('assets'))
app.use(bodyParser.json())


/* ROUTES */

app.get('/', (req, res) => {
	res.redirect('/module')
})

app.get('/module', (req, res) => {
	res.sendFile(path.join(`${__dirname}/cms/module.html`))
})

app.get('/section', (req, res) => {
	res.sendFile(path.join(`${__dirname}/cms/section.html`))
})


/* APIs */

app.get('/sectionList', (req, res) => {
	const buffer = db.readData('section')
	
	res.send(buffer)
})

app.post('/sectionAdd', (req, res) => {
	let newSection = req.body
	let buffer = db.readData('section')

	newSection.id = Date.now()
	buffer.push(newSection)
	db.updateData('section', buffer)
	res.send('ok')
})

app.post('/sectionDelete', (req, res) => {
	const id = req.body.id
	let buffer = db.readData('section').filter( obj => {
		return (obj.id !== id)
	})
	
	db.updateData('section', buffer)
	res.send('ok')
})

app.post('/sectionEdit', (req, res) => {
	const rawInput = req.body
	const input = {id: rawInput.id}
	if ( rawInput.sectionId ) input.sectionId = rawInput.sectionId
	if ( rawInput.sectionName ) input.sectionName = rawInput.sectionName
	if ( rawInput.sectionHeader ) input.sectionHeader = rawInput.sectionHeader
	if ( rawInput.sectionIcon ) input.sectionIcon = rawInput.sectionIcon

	let buffer = db.readData('section').map( obj => {
		if ( obj.id === input.id ) {
			const newData = Object.assign(obj, input)
			return newData
		}
		return obj
	})

	db.updateData('section', buffer)
	res.send('ok')
})

app.get('/moduleList', (req, res) => {
	const buffer = db.readData('module')
	
	res.send(buffer)
})

app.get('/getModule/:moduleId', (req, res) => {
	const id = req.params.moduleId
	const rawContent = db.readFile(`modules/${id}.html`)
	const content = rawContent.split('\n').splice(1).join('\n')

	res.send(content)
})

app.post('/moduleAdd', (req, res) => {
	const id = Date.now()
	const content = req.body.content
	let buffer = db.readData('module')
	let newModule = {
		id,
		name: req.body.name,
		section: req.body.section,
		url: `modules/${id}.html`,
	}

	buffer.push(newModule)

	db.updateData('module', buffer)
	db.writeFile(content, newModule)

	res.send('ok')
})

app.post('/moduleDelete', (req, res) => {
	const id = req.body.id
	let buffer = db.readData('module').filter( obj => {
		return (obj.id !== id)
	})
	
	db.updateData('module', buffer)
	db.removeFile(id)

	res.send('ok')
})

app.post('/moduleEdit', (req, res) => {
	const rawInput = req.body
	const content = rawInput.content
	const input = {
		id: rawInput.id,
		name: rawInput.name,
		url: rawInput.url,
		section: rawInput.section
	}
	
	let buffer = db.readData('module').map( obj => {
		if ( obj.id === input.id ) {
			const newData = Object.assign(obj, input)
			return newData
		}
		return obj
	})
	
	db.updateData('module', buffer)
	db.writeFile(content, input)

	res.send('ok')
})


/* WEB SERVER */

app.listen(port, () => {
	console.log(`running on localhost:${port}`)
	opn(`http://localhost:${port}`)
})