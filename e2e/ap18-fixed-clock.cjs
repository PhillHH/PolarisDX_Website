const RealDate = Date
const configuredNow = process.env.POLARIS_FIXED_NOW

if (!configuredNow) {
  throw new Error('POLARIS_FIXED_NOW is required for the AP18 closure clock')
}

const fixedTime = RealDate.parse(configuredNow)
if (!Number.isFinite(fixedTime)) {
  throw new Error(`Invalid POLARIS_FIXED_NOW: ${configuredNow}`)
}

function FixedDate(...args) {
  if (!new.target) return new RealDate(fixedTime).toString()
  return args.length === 0 ? new RealDate(fixedTime) : new RealDate(...args)
}

Object.setPrototypeOf(FixedDate, RealDate)
FixedDate.prototype = RealDate.prototype
FixedDate.now = () => fixedTime

global.Date = FixedDate
