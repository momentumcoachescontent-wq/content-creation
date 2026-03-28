type Props = {
  status: string
}

export default function StatusBadge({ status }: Props) {
  const styles: Record<string, React.CSSProperties> = {
    pending_review: { background: '#FEF3C7', color: '#92400E' },
    pending_approval: { background: '#DBEAFE', color: '#1E40AF' },
    approved: { background: '#D1FAE5', color: '#065F46' },
    rejected: { background: '#FEE2E2', color: '#991B1B' },
    scheduled: { background: '#E0E7FF', color: '#3730A3' },
    publish_error: { background: '#FECACA', color: '#7F1D1D' },
  }

  const style = styles[status] || { background: '#E5E7EB', color: '#111827' }

  return (
    <span
      style={{
        ...style,
        borderRadius: 999,
        padding: '4px 10px',
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  )
}