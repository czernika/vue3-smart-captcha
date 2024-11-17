// Skip Husky install in CI
// @see https://typicode.github.io/husky/how-to.html
if (process.env.CI === 'true') {
    process.exit(0)
}

const husky = (await import('husky')).default
console.log(husky())
