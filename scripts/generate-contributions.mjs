import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { calendarHash, validateProfileSnake } from '../src/lib/contribution-feed.ts'
import { normalizeContributions } from '../src/lib/github-contributions.ts'
import { saveBundle } from './sync-contribution-snake.mjs'

const token = process.env.GITHUB_TOKEN
if (!token) throw new Error('GITHUB_TOKEN is required to fetch the real contribution calendar')
const response = await fetch('https://api.github.com/graphql', {
  method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}', variables: { login: 'LeonWater1' } })
})
if (!response.ok) throw new Error(`GitHub calendar request failed (${response.status})`)
const data = await response.json()
const source = data.data?.user?.contributionsCollection?.contributionCalendar
const levels = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE']
const calendar = normalizeContributions({ contributions: source?.weeks.flatMap(week => week.contributionDays.map(day => ({ date: day.date, count: day.contributionCount, level: levels.indexOf(day.contributionLevel) }))), total: { lastYear: source?.totalContributions } })
if (!calendar) throw new Error('GitHub returned an invalid contribution calendar')
const directory = process.env.CONTRIBUTION_SVG_DIR
if (!directory) throw new Error('CONTRIBUTION_SVG_DIR must point to Platane/snk outputs')
const [light, dark] = await Promise.all(['github-contribution-grid-snake.svg', 'github-contribution-grid-snake-dark.svg'].map(name => readFile(resolve(directory, name), 'utf8')))
const geometry = validateProfileSnake(light, calendar, 'light')
const darkGeometry = validateProfileSnake(dark, calendar, 'dark')
if (geometry.duration !== darkGeometry.duration || geometry.width !== darkGeometry.width) throw new Error('Contribution animations do not match')
const now = new Date().toISOString()
await saveBundle({ calendar, light, dark, ...geometry, sourceCommit: process.env.GITHUB_SHA, fetchedAt: now, checkedAt: now, dataHash: await calendarHash(calendar), dataThrough: calendar.contributions.at(-1).date }, new URL('../', import.meta.url))
