import { cx } from '../lib/styles';

export default function StatusBadge({ value }: { value: string }) {
  const v = value || '';
  const tone = v.includes('Completed') || v.includes('Active') || v.includes('APPROVED')
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : v.includes('Rejected') || v.includes('Canceled') || v.includes('Withdrawn')
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-amber-200 bg-amber-50 text-amber-700';

  return (
    <span className={cx('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide', tone)}>
      {v || '-'}
    </span>
  );
}
