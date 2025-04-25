import { useQuery } from '@tanstack/react-query'

async function fetchMe() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' })
    if (res.status === 401) return null
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to fetch user')
    return data
  } catch (error) {
    throw new Error(error.message);
  }
}

export function useAuthUser() {
  return useQuery({
    queryKey: ['authUser'],
    queryFn:   fetchMe,
    retry:     false
  })
}
