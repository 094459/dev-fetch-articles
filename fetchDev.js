/*
 * curl -H "api-key: API_KEY" https://dev.to/api/articles/me/published
 */

// Amended from original script at iggredible/dev-fetch-articles
// to export md in files that I can use in Hugo

require('dotenv').config()
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const URL = 'https://dev.to/api/articles/me/published'

const options = {
  headers: { 'api-key': process.env.DEV_KEY },
  params: { 'per_page' : 1000 }
}
const contentDir = '/content/'
const contentPath = __dirname + contentDir

const dir = './content'

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
} // if it exists, then we need to clear it up first

axios
  .get(URL, options)
  .then(response => {
    response.data.forEach(article => {
      const normalizedTitle = article.title
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase()
      const normalizedPublishedAt = article.published_at.split('T')[0]
      const fileName = `${normalizedPublishedAt}_${normalizedTitle}.md`
      const markdown = article.body_markdown.split('\n')
      const hugomarkdown = "---"
      const hugotags = "tags : [ oss-newsletter ]"
      const hugotitle = article.title
      const markdownDate = `date: '${normalizedPublishedAt}'`
      const markdownTitle = `title: '${hugotitle}'`
      let markdownSplice = markdown.splice(0, 0, hugomarkdown, markdownTitle, markdownDate, hugotags, hugomarkdown)

      console.log(`${contentDir}${fileName} created!`)
      fs.writeFileSync(
        `${contentPath}${fileName}`,
        markdown.join('\n'),
        'utf-8'
      )
    })
    console.log('*** dev.to data successfully fetched ***')
  })
  .catch(error => {
    console.log('ERROR: ', error)
  })

