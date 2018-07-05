let meta

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  if (tabs.length > 0 && tabs[0].id) {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'extract' }, data => {
      meta = data
      renderMarkdown()
    })
  }
})

const tabs = document.querySelectorAll('.btn-tab')
const $btnMD = document.querySelector('.btn-md')
const $btnJSON = document.querySelector('.btn-json')
const $textarea = document.querySelector('.txt')

$btnMD.onclick = renderMarkdown
$btnJSON.onclick = renderJSON


function renderMarkdown () {
  tabs.forEach($tab => $tab.classList.remove('active'))
  $btnMD.classList.add('active')

  if (!meta) {
    $textarea.value = ''
    return
  }

  /* -------------------------------------------------------- *\
     Front Matter
  \* -------------------------------------------------------- */

  let frontMatter = ''
  if (meta.difficulty) {
    frontMatter += `Difficulty: ${meta.difficulty}\n`
  }

  if (meta.topics.length > 0) {
    frontMatter += `Related Topics:\n`
    meta.topics.forEach(topic => frontMatter += `  "${topic.title.replace(/"/g, '\\"')}": ${topic.href}\n`)
  }

  if (meta.questions.length > 0) {
    frontMatter += `Similar Questions:\n`
    meta.questions.forEach(question => frontMatter += `  "${question.title.replace(/"/g, '\\"')}": ${question.href}\n`)
  }

  if (frontMatter) {
    frontMatter = `---\n${frontMatter}---\n\n`
  }

  /* -------------------------------------------------------- *\
     Markdown Content
  \* -------------------------------------------------------- */

  let content = ''
  
  if (meta.title) {
    content += `## [${meta.title}](${meta.href})\n\n`
  }

  if (meta.problem) {
    content += `### Problem:\n\n`
    content += `${meta.problem}\n\n`
    content += `### Solution:\n\n\n\n\n`
  }

  /* -------------------------------------------------------- *\
     Footer
  \* -------------------------------------------------------- */

  let footer = '*Template generated via [Leetmark](https://github.com/crimx/crx-leetmark).*\n\n'

  $textarea.value = frontMatter + content + footer
  $textarea.focus()
  $textarea.select()
}

function renderJSON () {
  tabs.forEach($tab => $tab.classList.remove('active'))
  $btnJSON.classList.add('active')

  if (!meta) {
    $textarea.value = ''
    return
  }

  try {
    $textarea.value = JSON.stringify(meta, null, '  ')
    $textarea.focus()
    $textarea.select()
  } catch (e) {
    console.warn(e)
  }
}
