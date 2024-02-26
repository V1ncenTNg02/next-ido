export const hasImageExt = (src: string) => new RegExp(/.(jpg|jpeg|png|svg)/).test(src.toLowerCase())
