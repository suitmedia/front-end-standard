const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

app.use(express.static('cms'))
app.use(express.static('assets'))
app.use(bodyParser.json())








/* CORE FUNCTION */

const readConfig = (configFile) => {
  let section = fs.readFileSync(`configs/${configFile}list.js`, "utf8").split('\n')

  section.shift()
  return (JSON.parse(section.join('\n')))
}

const storeSection = newData => {
	const topBuffer = 'var sectionList = \n'
	let buffer = topBuffer + JSON.stringify(newData)
	
  fs.writeFileSync('configs/sectionlist.js', buffer, {encoding: 'utf8'})
}

const storeModule = (newData) => {
	const topBuffer = 'var moduleList = \n'
	let buffer = topBuffer + JSON.stringify(newData)
 
  fs.writeFileSync('configs/modulelist.js', buffer, {encoding: 'utf8'})
}

const writeFile = (content, module) => {

	if (content) {
		let newContent = `## ${module.name}\n${content}`

  	fs.writeFileSync(module.url, newContent, {encoding: 'utf8'})
  }
}








/* ROUTES */

app.get('/', (req, res) => {
	res.sendFile(path.join(`${__dirname}/cms/index.html`))
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
	storeSection(bufferObj)
	res.send('ok')
})

app.post('/sectionDelete', (req, res) => {
	const id = req.body.id
	let buffer = readConfig('section').filter( obj => {
		return !( obj.id === id )
	})
	
	storeSection(buffer)
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

	storeSection(buffer)
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

	//console.log(content)

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

	storeModule(bufferObj)
	writeFile(content, newModule)

	res.send('ok')
})

app.post('/moduleDelete', (req, res) => {
	const id = req.body.id
	let buffer = readConfig('module').filter( obj => {
		return !( obj.id === id )
	})
	
	storeModule(buffer)
	fs.unlinkSync(`modules/${id}.html`)

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
	
	//console.log(buffer)
	//console.log(content)

	storeModule(buffer)
	writeFile(content, input)

	res.send('ok')
})









/* WEB SERVER */

app.listen(5000, () => {
	console.log('running on 5000')
})