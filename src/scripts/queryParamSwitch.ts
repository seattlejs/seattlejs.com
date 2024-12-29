/**
 * Show certain elements only when certain query parameters are available. This
 * function takes an array of queryKey to element selector mappings and shows
 * the element corresponding to the first queryKey that is present in the URL.
 *
 *  They are mutually exclusive, so only one element will be shown at a time.
 *
 * A key of empty string will represent the default case, which will be shown
 * when no other query parameters are present.
 *
 * @param cases - A mapping of query parameter values to element selectors.
 */
export function initializeSwitch(
  cases: Array<[queryKey: string, selector: string]>,
): void {
  const searchParams = new URLSearchParams(location.search)
  const queryKey =
    cases.map(([key]) => key).find(key => searchParams.has(key)) || ''

  for (const [key, selector] of cases) {
    const elements = document.querySelectorAll<HTMLElement>(selector)
    for (const element of elements) {
      if (key === queryKey) {
        element.removeAttribute('hidden')
        element.style.display = ''
      } else {
        element.setAttribute('hidden', '')
        element.style.display = 'none'
      }
    }
  }
}
