const express = require("express")
const axios = require("axios")

const app = express() // app 是一个 express 实例

const apiRoutes = express.Router() // 创建一个路由模块

apiRoutes.get("/getDiscList", function(req, res) {
  const url = "https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg"
  axios
    .get(url, {
      headers: {
        referer: "https://c.y.qq.com/",
        host: "c.y.qq.com"
      },
      params: req.query
    })
    .then(response => {
      res.append("Access-Control-Allow-Origin", "*")
      res.json(response.data)
    })
    .catch(e => {
      console.log(e)
    })
})

apiRoutes.get("/getSongUrl", function(req, res) {
  const url = "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg"
  axios
    .get(url, {
      headers: {
        // 添加请求头，伪造referer和host
        referer: "https://y.qq.com/portal/player.html",
        host: "y.qq.com"
      },
      params: req.query
    })
    .then(response => {
      res.append("Access-Control-Allow-Origin", "*") // 添加响应头，设置cors
      res.json(response.data)
    })
    .catch(e => {
      console.log(e)
    })
})

apiRoutes.get("/getSongList", function(req, res) {
  const url = "https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg"
  console.log(req.query)
  axios
    .get(url, {
      headers: {
        // 添加请求头，伪造referer和host
        referer: "https://c.y.qq.com/",
        host: "y.qq.com"
      },
      params: req.query
    })
    .then(response => {
      res.append("Access-Control-Allow-Origin", "*") // 添加响应头，设置cors
      res.json(response.data)
    })
    .catch(e => {
      console.log(e)
    })
})

apiRoutes.get("/getLyric", function(req, res) {
  const url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg"
  axios
    .get(url, {
      headers: {
        referer: "https://c.y.qq.com/",
        host: "c.y.qq.com"
      },
      params: req.query
    })
    .then(response => {
      let ret = response.data
      if (typeof ret === "string") {
        // 通过正则处理jsonp的返回
        const reg = /^\w+\(({[^()]+})\)$/
        const matches = ret.match(reg)
        if (matches) {
          ret = JSON.parse(matches[1])
        }
      }
      res.append("Access-Control-Allow-Origin", "*")
      res.json(ret)
    })
    .catch(e => {
      console.log(e)
    })
})

app.use("/api", apiRoutes) // 加载路由模块，可处理发自 /api/getSongUrl 和 /api/getLyric 的请求

app.listen(3000, function() {
  // 监听localhost:3000端口
  console.log("Example app listening on port 3000!")
})
