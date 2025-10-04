// sets string to lowercase for consistancy 
// splits the string at the space chars
// filters out any double spaces
// then joins the strings with -
export const kebabCase = (value: string) => value.toLowerCase().split(" ").filter(item => !!item).join("-")