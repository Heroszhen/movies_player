import { defineConfig } from 'unocss'

export default defineConfig({
    rules: [
        [/^hero-bg-color-(.+)$/, ([, color]) => ({ 'background-color': `#${color}` })],
        [/^hero-color-(.+)$/, ([, color]) => ({ 'color': `#${color}` })],
        [/^hero-width-(\d+)$/, ([, width]) => ({ 'width': `${width}px` })],
        [/^hero-m-(\d+)$/, ([, size]) => ({ 'margin': `${size}px` })],
        [/^hero-m-(\w+)-(\d+)$/, ([, position, size]) => ({ [`margin-${position}`]: `${size}px` })],
        [/^hero-p-(\d+)$/, ([, size]) => ({ 'padding': `${size}px` })],
        [/^hero-p-(\w+)-(\d+)$/, ([, position, size]) => ({ [`padding-${position}`]: `${size}px` })],
        [/^hero-fs-(\d+)$/, ([, size]) => ({ 'font-size': `${size}px` })],
        [/^hero-cursor-(\w+)$/, ([, cursor]) => ({ 'cursor': cursor })],
        [/^hero-zindex-(\d+)$/, ([, index]) => ({ 'z-index': index })],
        [/^hero-maxh-(\d+)$/, ([, size]) => ({ 'max-height': `${size}px` })],
        [/^hero-minh-(\d+)$/, ([, size]) => ({ 'min-height': `${size}px` })],
    ]
})