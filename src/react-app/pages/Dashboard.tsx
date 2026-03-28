import { useEffect, useState } from 'react'
import AssetCard from '../components/AssetCard'
import { approveAsset, getAssets, getAssetSummary, rejectAsset } from '../lib/api'
import type { AssetSummary, ContentAsset } from '../lib/types'

const filters = [
  'all',
  'pending_review',
  'pending_approval',
  'approved',
  'scheduled',
  'publish_error',
  'rejected',
] as const

export default function Dashboard() {
  const [items, setItems] = useState<ContentAsset[]>([])
  const [summary, setSummary] = useState<AssetSummary | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      setError(null)

      const [summaryRes, assets] = await Promise.all([
        getAssetSummary(),
        getAssets(selectedStatus === 'all' ? undefined : selectedStatus),
      ])

      setSummary(summaryRes.summary)
      setItems(assets)
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
    await rejectAsset(id, 'Rejected from dashboard')
    await load()
  }

  useEffect(() => {
    load()
  }, [selectedStatus])

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h1>Content Ops Dashboard</h1>
      <p>Control tower for content generation, approval and publishing.</p>

      {summary && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 12,
            margin: '24px 0',
          }}
        >
          {Object.entries(summary).map(([key, value]) => (
            <div
              key={key}
              style={{
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 12, color: '#6B7280' }}>{key}</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedStatus(filter)}
            style={{
              background: selectedStatus === filter ? '#111827' : 'white',
              color: selectedStatus === filter ? 'white' : '#111827',
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <button onClick={load} style={{ marginBottom: 16 }}>
        Refresh
      </button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && items.length === 0 && <p>No assets found.</p>}

      {items.map((item) => (
        <AssetCard
          key={item.id}
          item={item}
          onApprove={
            item.status === 'pending_review' || item.status === 'pending_approval'
              ? handleApprove
              : undefined
          }
          onReject={
            item.status === 'pending_review' || item.status === 'pending_approval'
              ? handleReject
              : undefined
          }
        />
      ))}
    </main>
  )
}