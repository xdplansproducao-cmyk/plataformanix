export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  },
  set: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('token', token)
  },
  remove: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

export const userStorage = {
  get: () => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
  set: (user: any): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('user', JSON.stringify(user))
  },
  remove: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('user')
  },
}
