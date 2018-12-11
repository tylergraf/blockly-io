import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: './game-client.mjs',
  output: {
    file: 'dist/bundle.js',
    format: 'es'
  },
  plugins: [
    commonjs({
      include: 'node_modules/socket.io-client/**'
    }),
    resolve()
  ]
}
