const { exec, escape } = require('../db/mysql')
const xss = require('xss')

// 数据安全处理：包括escape进行sql注入处理、xss进行xss攻击处理
const safeValue = (value) => {
  value = escape(value)
  value = xss(value)
  return value
}

const getBlogList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
    author = escape(author)
    sql += `and author = ${author} `
  }
  if (keyword) {
    // keyword = escape(keyword)
    sql += `and title like '%${keyword}%' `
  }
  sql += 'order by createtime desc;'
  return exec(sql)
}

getBlogDetail = (id, username) => {
  let sql = `select * from blogs where 1=1 and id = ${id} `
  if (username) {
    username = escape(username)
    sql += `and author = ${username}`
  }
  return exec(sql)
}

addBlog = (blogData = {}) => {
  let { title, content, author, createtime } = blogData
  title = safeValue(title)
  content = safeValue(content)
  author = escape(author)
  createtime = escape(createtime)
  const sql = `insert into blogs (title, content, createtime, author)
              values (${title}, ${content}, ${createtime}, ${author})`
  return exec(sql).then(insertData => {
    // console.log(insertData)
    // {
    //   fieldCount: 0,
    //   affectedRows: 1,
    //   insertId: 3,
    //   serverStatus: 2,
    //   warningCount: 0,
    //   message: '',
    //   protocol41: true,
    //   changedRows: 0 }
    return {
      id: insertData.insertId
    }
  })
}

updateBlog = (id, blogData = {}) => {
  let { title, content } = blogData
  title = safeValue(title)
  content = safeValue(content)
  const sql = `update blogs set title=${title}, content=${content} where id =${id}`
  return exec(sql).then(updateData => {
    // console.log(updateData)
    // {
    //   fieldCount: 0,
    //   affectedRows: 1,
    //   insertId: 0,
    //   serverStatus: 2,
    //   warningCount: 0,
    //   message: '(Rows matched: 1  Changed: 1  Warnings: 0',
    //   protocol41: true,
    //   changedRows: 1 }
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}
deleteBlog = (id, author) => {
  author = escape(author)
  const sql = `delete from blogs where id =${id} and author=${author}`
  return exec(sql).then(deleteData => {
    if (deleteData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getBlogList,
  getBlogDetail,
  addBlog,
  updateBlog,
  deleteBlog
}
