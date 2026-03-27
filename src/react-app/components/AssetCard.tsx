import type { ContentAsset } from '../lib/types'

type Props = {
  item: ContentAsset
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export default function AssetCard({ item, onApprove, onReject }: Props) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <strong>{item.platform}</strong> · {item.format}
        </div>
        <div>
          status: <strong>{item.status}</strong>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div><strong>Hook:</strong></div>
        <div>{item.hook || '—'}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div><strong>Body:</strong></div>
        <div style={{ whiteSpace: 'pre-wrap' }}>{item.body || '—'}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div><strong>CTA:</strong></div>
        <div>{item.cta || '—'}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        quality: <strong>{item.quality_score}</strong> | risk: <strong>{item.risk_score}</strong>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={() => onApprove(item.id)}>Approve</button>
        <button onClick={() => onReject(item.id)}>Reject</button>
      </div>
    </div>
  )
}