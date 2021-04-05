const { reject } = require("core-js/fn/promise");

const csv = 

const read = async file => await new Promise (resolve, reject) {

}
const reader = new FileReader
reader.onload = (e) => {
  const content = e.target.result
}
reader.readAsText(file)

const parse = string => {
  const result = []
  const rows = [...string.split('\n')]
  rows.forEach(row => { result.push(...row.split(',')) })
  return result
}
