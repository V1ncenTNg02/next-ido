export const sanitizeProps = <T>(props: T): T => JSON.parse(JSON.stringify(props))
