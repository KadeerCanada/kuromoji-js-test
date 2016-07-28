var kuromoji = require('kuromoji')
var loki = require('lokijs')

var initTokenizer = new Promise((resolve, reject) => {
  kuromoji.builder({ dicPath: './node_modules/kuromoji/dist/dict/' }).build((err, tokenizer) => {
    if (err) {
      reject(err)
    } else {
      resolve(function (str) {
        return tokenizer.tokenize(str)
          .filter((token) => token.pos !== '助詞' && token.pos_detail_1 !== '数')
          .map((token) => token.basic_form)
      })
    }
  })
})

var initDb = new Promise((resolve, reject) => {
  resolve(new loki('loki.json'))
})

Promise.all([initTokenizer, initDb]).then((values) => {
  var tokenizer = values[0]
  var db = values[1]

  var items = db.addCollection('items')

  items.insert({
    url: 'hogehoge',
    tokens: tokenizer('こんにちは、私がガンダムです')
  })

  var result = items.find({ tokens: { '$contains': tokenizer('ガンダム') } })

  console.log(result)

  console.log(db.serialize())
}, (err) => {
  console.error(err)
})

