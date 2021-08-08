const $btn = document.querySelector('.manual__btn')
const $code = document.querySelector('.manual__code__text')
const $svg = document.querySelector('.copied')
const $input = document.querySelector('[name="userToken"]')
const $log = document.querySelector('.manual__log')
const $formBtn = document.querySelector('.manual__form__btn')

ConsoleLogHTML.DEFAULTS.error = 'log-message--error'
ConsoleLogHTML.DEFAULTS.log = 'log-message'
ConsoleLogHTML.connect($log)

// ===== helper =====
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const errorTable = {
  ERROR__SERVER_ERROR: '系統忙碌中，請稍後再試！',
  ERROR__BAD_REQUEST: '系統錯誤，請稍後再試！',
  ERROR__CODE_ALREADY_REDEEMED: '已經輸入過這個序號囉',
  ERROR__ENTER_CODE_AMOUNT_OUT_OF_QUOTA: '您輸入邀請碼的數量已經達到上限囉',
  ERROR__INVALID_CODE: '序號錯誤',
  ERROR__OWNED_CODE: '不能輸入自己的邀請碼喔',
  ERROR__UNDER_MAINTENANCE: '系統維護中',
  ERROR__INVITATION_AMOUNT_NOT_ENOUGH: '對方的邀請名額不足',
  ERROR__CODE_OUT_OF_QUOTA: '序號已經被兌換完畢了',
  ERROR__INVITER_PROGRESS_FULL: '對方尚未開啟新的一輪集 Fun'
}

// ===== 送出請求 =====
async function getCode () {
  $btn.disabled = true
  $svg.style.opacity = 1
  try {
    const { data } = await axios.get('/api/invitation-code?size=1')
    $code.innerText = data.code
    navigator.clipboard.writeText(data.code)
  } catch (error) {
    console.error(error)
  } finally {
    $btn.disabled = false
  }
}

async function enterCode (userToken, code, csrfToken = '') {
  try {
    const { data } = await axios.post('/api/enter-code', {
      userToken,
      code,
      csrfToken
    })
    return data
  } catch (error) {
    console.error(error)
  }
}
let isRunning = false
async function autoEnterCode () {
  if (isRunning) return
  const userToken = $input.value
  if (!userToken.match(/[a-zA-Z0-9]{64}/)) {
    console.error('Token錯誤，應為64位之英數字')
    return
  }
  isRunning = true
  $formBtn.disabled = true

  let finished = false
  $input.disabled = true

  console.log('喀咚...')
  await sleep(400)
  console.log('哐啷...')
  await sleep(400)
  console.log('機器人啟動...')

  while (!finished) {
    const { data } = await axios.get('/api/invitation-code?size=50')
    const codes = data.code
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i]

      const data = await enterCode(userToken, code)
      if (data.error) {
        console.error(
          errorTable?.[data.error] ? errorTable?.[data.error] : data.error
        )
      } else {
        console.log(`輸入${code}成功！現在共輸入：${data.enter_code_amount}／60`)
      }
      if (
        data?.error === 'ERROR__ENTER_CODE_AMOUNT_OUT_OF_QUOTA' ||
        data?.enter_code_amount === 60
      ) {
        console.log('60個名額都輸入完畢囉，退出程式...')
        finished = true
        break
      }
      await sleep(400)
    }
  }
  $input.disabled = false
  $formBtn.disabled = false
  isRunning = false
}

async function handleClick () {
  const userToken = $input.value
  await enterCode(userToken, code)
}
