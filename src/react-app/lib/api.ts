import type { ContentAsset } from './types'

export async function getPendingAssets(): Promise<ContentAsset[]> {
  const res = await fetch('/api/assets/pending')
  if (!res.ok) throw new Error('Failed to fetch pending assets')

  const json = await res.json()
  return json.items ?? []
}

export async function approveAsset(id: string) {
  const res = await fetch(`/api/approvals/${id}/approve`, {
    method: 'POST',
  })

  if (!res.ok) throw new Error('Failed to approve asset')
  return res.json()
}

export async function rejectAsset(id: string, reviewNotes?: string) {
  const res = await fetch(`/api/approvals/${id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      review_notes: reviewNotes ?? '',
    }),
  })

  if (!res.ok) throw new Error('Failed to reject asset')
  return res.json()
}