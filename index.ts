import fetch from 'node-fetch'
import { xml2js } from 'xml-js'
import * as dayjs from 'dayjs'

const getHolidays = async () => {
  const response = await fetch(`http://services.sapo.pt/Holiday/GetNationalHolidays?year=${dayjs().year()}`)
  const body = await response.text()
  const data: any = xml2js(body, { compact: true })
  const holidaysRes = data.GetNationalHolidaysResponse.GetNationalHolidaysResult.Holiday.map((day: any) => dayjs(day.Date._text).format('YYYY-MM-DD'))

  // ? - Carnaval sendo feriado opcional, é para contar como dia útil?
  const holidays = holidaysRes.filter((_, i) => i !== 1)

  return holidays
}

const calculate24Hours = (today: dayjs.Dayjs, holidays: String[]) => {
  const tomorrow = today.add(1, 'day')
  if (tomorrow.day() !== 0 && tomorrow.day() !== 6 && !holidays.includes(tomorrow.format('YYYY-MM-DD'))) {
    console.log(tomorrow.format('YYYY-MM-DD HH:mm:ss'))
  } else {
    calculate24Hours(tomorrow, holidays)
  }
}

(async () => {
  // * Day of the weekend
  // const today = dayjs('2021-01-29 12:02:01')
  // * Holiday day
  // const today = dayjs('2021-04-02 12:02:01')
  // * Today
  const today = dayjs()
  
  const holidays = await getHolidays()

  console.info(`${today.format('YYYY-MM-DD HH:mm:ss')} -->`)
  return calculate24Hours(today, holidays)
})();