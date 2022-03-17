
import typescript from '@rollup/plugin-typescript';
export default [
    {
    input:'src/receiver.ts',
    plugins: [typescript()],
    output: {dir: 'dist'}
    },
    {
    input:'src/sender.ts',
    plugins: [typescript()],
    output: {dir: 'dist'}
    }
]