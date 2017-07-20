const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

app.use(express.static('cms'))
app.use(express.static('assets'))
app.use(bodyParser.json())








/* CORE FUNCTION */

const readConfig = configFile => {
  let section = fs.readFileSync(`configs/${configFile}list.js`, "utf8").split('\n')

  section.shift()
  return (JSON.parse(section.join('\n')))
}

const storeConfig = (configFile, newData) => {
	const topBuffer = `var ${configFile}List = \n`
	let buffer = topBuffer + JSON.stringify(newData)
	
  fs.writeFileSync(`configs/${configFile}list.js`, buffer, {encoding: 'utf8'})
}

const writeFile = (content, module) => {
	if (content) {
		let newContent = `## ${module.name}\n${content}`

  	fs.writeFileSync(module.url, newContent, {encoding: 'utf8'})
  }
}

const removeFile = moduleId => {
	fs.unlinkSync(`modules/${moduleId}.html`)
}









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
	const bufferObj = readConfig('section')
	
	res.send(bufferObj)
})

app.post('/sectionAdd', (req, res) => {
	let newSection = req.body
	let bufferObj = readConfig('section')

	newSection.id = Date.now()
	bufferObj.push(newSection)
	storeConfig('section', bufferObj)
	res.send('ok')
})

app.post('/sectionDelete', (req, res) => {
	const id = req.body.id
	let buffer = readConfig('section').filter( obj => {
		return !( obj.id === id )
	})
	
	storeConfig('section', buffer)
	res.send('ok')
})

app.post('/sectionEdit', (req, res) => {
	const rawInput = req.body
	const input = {id: rawInput.id}
	if (rawInput.sectionId) input.sectionId = rawInput.sectionId
	if (rawInput.sectionName) input.sectionName = rawInput.sectionName
	if (rawInput.sectionHeader) input.sectionHeader = rawInput.sectionHeader
	if (rawInput.sectionIcon) input.sectionIcon = rawInput.sectionIcon

	let buffer = readConfig('section').map( obj => {
		if (obj.id === input.id) {
			const newData = Object.assign(obj, input)
			return newData
		}
		else
			return obj
	})

	storeConfig('section', buffer)
	res.send('ok')
})

app.get('/moduleList', (req, res) => {
	const bufferObj = readConfig('module')
	
	res.send(bufferObj)
})

app.get('/getModule/:moduleId', (req, res) => {
	const id = req.params.moduleId
	const rawContent = fs.readFileSync(`modules/${id}.html`, "utf8")
	const content = rawContent.split('\n').splice(1).join('\n')

	res.send(content)
})

app.post('/moduleAdd', (req, res) => {
	const id = Date.now()
	const content = req.body.content
	let bufferObj = readConfig('module')
	let newModule = {
		id,
		name: req.body.name,
		section: req.body.section,
		url: `modules/${id}.html`,
	}

	bufferObj.push(newModule)

	storeConfig('module', bufferObj)
	writeFile(content, newModule)

	res.send('ok')
})

app.post('/moduleDelete', (req, res) => {
	const id = req.body.id
	let buffer = readConfig('module').filter( obj => {
		return !( obj.id === id )
	})
	
	storeConfig('module', buffer)
	removeFile(id)

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
	
	let buffer = readConfig('module').map( obj => {
		if (obj.id === input.id) {
			const newData = Object.assign(obj, input)
			return newData
		}
		else
			return obj
	})
	
	storeConfig('module', buffer)
	writeFile(content, input)

	res.send('ok')
})









/* WEB SERVER */

app.listen(5000, () => {
	console.log('running on localhost:5000')
})