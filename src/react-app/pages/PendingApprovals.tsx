import { useEffect, useState } from 'react'
import AssetCard from '../components/AssetCard'
import { approveAsset, getPendingAssets, rejectAsset } from '../lib/api'
import type { ContentAsset } from '../lib/types'

export default function PendingApprovals() {
  const [items, setItems] = useState<ContentAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const data = await getPendingAssets()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id: string) {
    await approveAsset(id)
    await load()
  }

  async function handleReject(id: string) {
    await rejectAsset(id, 'Rejected from approval panel')
    await load()
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1>Pending Approvals</h1>
      <p>Assets waiting for editorial decision.</p>

      <button onClick={load} style={{ marginBottom: 16 }}>
        Refresh
      </button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && items.length === 0 && <p>No pending assets found.</p>}

      {items.map((item) => (
        <AssetCard
          key={item.id}
          item={item}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </main>
  )
}