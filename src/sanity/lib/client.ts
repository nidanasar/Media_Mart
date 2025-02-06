import { createClient } from 'next-sanity'


export const client = createClient({
  projectId:"3t0bkfvg",
  dataset: "production",
  apiVersion:"2025-02-06",
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token: "skKR3yVvCDOJRoBzvBZWB8E5V1Q0j8mdc4bR6AjweWU2dbZPqAIMNsl0rRxEJ7rYoQqZznWwxDFn0SW7E9CmtHglNKj0GgtrmWKTivMK2rcooDQ6usq90FW3giPaIE8qO05fn20RdWYXNmpAeOvXP6Z2e5X1l8CjHQ3IRZ0uimWgcY28Fid8",
})
