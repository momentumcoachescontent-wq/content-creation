type Props = { status: string }

export default function StatusBadge({ status }: Props) {
  return <span>{status}</span>
}