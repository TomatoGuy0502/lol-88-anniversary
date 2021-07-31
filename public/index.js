const btn = document.querySelector('.manual__btn')
const code = document.querySelector('.manual__code__text')
const svg = document.querySelector('.copied')

async function getCode() {
  btn.disabled = true
  svg.style.opacity = 1
  try {
    const { data } = await axios.get('/api/invitation-code?size=1')
    code.innerText = data.code
    navigator.clipboard.writeText(data.code)
  } catch (error) {
    console.error(error)    
  } finally {
    btn.disabled = false
  }
}

async function enterCode(userToken, csrfToken, code) {
  const headers = {
    // 'Referer': `https://bargain.lol.garena.tw/?token=${userToken}`,
    'Token': userToken,
    'X-CSRFToken': csrfToken,
    'Content-Type': 'application/json'
  }
  const data = { code, confirm: true }
  try {
    const res = await axios.post('https://bargain.lol.garena.tw/api/enter', data, { headers })
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}