chrome.runtime.sendMessage({ type: 'page_action_show' })

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case 'extract':
      sendResponse(extract())
      return
  }
})

function extract () {
  return {
    title: extractTitle(),
    href: window.location.href,
    problem: extractProblem(),
    difficulty: extractDifficulty(),
    topics: extractTags('tags-topics'),
    questions: extractTags('tags-question'),
  }
}

/**
 * @return {string}
 */
function extractTitle () {
  const $title = document.querySelector('h3')
  if (!$title) { return '' }
  return ($title.textContent || '').trim()
}

/**
 * @return {string}
 */
function extractProblem () {
  const $desp = document.querySelector('.question-description__3U1T')
  if (!$desp) { return '' }

  const $problem = document.createElement('div')
  $problem.innerHTML = $desp.innerHTML

  // pre first. clean any tag inside pre.
  $problem.querySelectorAll('pre').forEach($el => {
    const content = ($el.textContent || '').trim()
    $el.outerHTML = content ? `\n\n\`\`\`\n${content}\n\`\`\`\n\n` : ''
  })

  $problem.querySelectorAll('strong').forEach($el => {
    const content = ($el.textContent || '').trim()
    $el.outerHTML = content ? `**${content}**` : ''
  })

  $problem.querySelectorAll('em').forEach($el => {
    const content = ($el.textContent || '').trim()
    $el.outerHTML = content ? `*${content}*` : ''
  })

  $problem.querySelectorAll('code').forEach($el => {
    const content = ($el.textContent || '').trim()
    $el.outerHTML = content ? `\`${content}\`` : ''
  })

  $problem.querySelectorAll('a').forEach($el => {
    const content = ($el.textContent || '').trim()
    const href = ($el.getAttribute('href') || '').replace(/^\//, 'https://leetcode.com/')
    $el.outerHTML = `[${content}](${href})`
  })

  $problem.querySelectorAll('p').forEach($el => {
    const content = ($el.textContent || '').trim()
    $el.outerHTML = content ? `\n\n${content}\n\n` : ''
  })

  $problem.querySelectorAll('div').forEach($el => {
    const content = ($el.textContent || '').trim()
    $el.outerHTML = content ? `\n\n${content}\n\n` : ''
  })

  return ($problem.textContent || '').replace(/\n\s*\n/g, '\n\n').trim()
}

/**
 * @return {string}
 */
function extractDifficulty () {
  const $difficulty = document.querySelector('.difficulty-label')
  if (!$difficulty) { return '' }
  return ($difficulty.textContent || '').trim()
}

/**
 * @param {string} tagid
 * @return {Array.<{{ title: string, href: string }}>}
 */
function extractTags (tagid) {
  const result = []
  const $topics = document.getElementById(tagid)

  if ($topics) {
    $topics.querySelectorAll('a').forEach($a => {
      const title = ($a.textContent || '').trim()
      const href = ($a.getAttribute('href') || '').replace(/^\//, 'https://leetcode.com/')
      if (title && href) {
        result.push({ title, href })
      }
    })
  }

  return result
}