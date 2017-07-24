const fs = require('fs')

module.exports = {

	readFile: function(fileName) {
		const body = fs.readFileSync(fileName, 'utf8')
		return body
	},

	writeFile: function(content, module) {
		if ( module ) {
			let newContent = `## ${module.name}\n${content}`
	  	fs.writeFileSync(module.url, newContent, {encoding: 'utf8'})
	  }
	},

	removeFile: function(moduleId) {
		fs.unlinkSync(`modules/${moduleId}.html`)
	},

	readData: function(configFile) {
	  const section = this.readFile(`configs/${configFile}list.js`).split('\n')
	  
	  section.shift()
	  return (JSON.parse(section.join('\n')))
	},

	updateData: function(configFile, newData) {
		const topBuffer = `var ${configFile}List = \n`
		const buffer = topBuffer + JSON.stringify(newData)
		
	  fs.writeFileSync(`configs/${configFile}list.js`, buffer, {encoding: 'utf8'})
	}

}