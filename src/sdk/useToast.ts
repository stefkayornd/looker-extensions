// TODO implement toast or use existing from Looker
export function useToast() {
  return {
    success: (message: string) => {
      console.log(message)
    },
    error: (message: string) => {
      console.log(message)
    },
  }
}
