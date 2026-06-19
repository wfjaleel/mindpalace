/**
* @type {import('vite').UserConfig}
*/
export default {
  base: '/',
  build: {
    sourcemap: true
  },
  server: {
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-eval';"
    }
  }
}