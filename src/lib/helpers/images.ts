export function squareSrcSet(url: string) {
  return `
    ${url}/w=400,h=400,fit=cover 400w,
    ${url}/w=800,h=800,fit=cover 800w,
    ${url}/w=1200,h=1200,fit=cover 1200w,
    ${url}/w=1600,h=1600,fit=cover 1600w,
    ${url}/w=2400,h=2400,fit=cover 2400w
  `
}

export function heroHandheldSrcSet(url: string) {
  return `
    ${url}/w=400,h=421,fit=cover 400w,
    ${url}/w=800,h=841,fit=cover 800w,
    ${url}/w=1200,h=1262,fit=cover 1200w,
    ${url}/w=1600,h=1682,fit=cover 1600w,
    ${url}/w=2400,h=2523,fit=cover 2400w
  `
}

export function heroSrcSet(url: string) {
  return `
    ${url}/w=800,h=324,fit=cover 800w,
    ${url}/w=1200,h=486,fit=cover 1200w,
    ${url}/w=1600,h=648,fit=cover 1600w,
    ${url}/w=2400,h=972,fit=cover 2400w
  `
}

export function portraitSrcSet(url: string) {
  return `
    ${url}/w=800,h=1067,fit=cover 800w,
    ${url}/w=1200,h=1600,fit=cover 1200w,
    ${url}/w=1600,h=2133,fit=cover 1600w,
    ${url}/w=2400,h=3200,fit=cover 2400w
  `
}

export function productSrcSet(url: string) {
  return `
    ${url}/w=145,h=290,fit=cover 1x,
    ${url}/w=290,h=580,fit=cover 2x,
    ${url}/w=435,h=870,fit=cover 3x,
  `
}
