export const ui = {
  page: 'min-h-screen bg-slate-50 text-slate-950',
  appPage: 'min-h-screen bg-slate-50 text-slate-950 lg:flex',
  main: 'min-w-0 flex-1 p-4 sm:p-6 lg:p-7',
  topbar: 'mb-6 rounded-xl bg-white border border-[#2B245C] px-6 py-6 shadow-lg sm:px-6',
  card: 'rounded-xl border border-slate-500 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg',
  flatCard: 'rounded-lg border border-blue-100 bg-blue-50/40 p-5',
  title: 'text-2xl font-bold text-[#2B245C] sm:text-3xl',
  sectionTitle: 'text-lg font-semibold text-slate-950',
  subtle: 'mt-1 text-sm leading-6 text-slate-600',
  grid: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4',
  grid2: 'grid gap-4 md:grid-cols-2',
  form: 'grid gap-4',
  field: 'grid gap-2',
  label: 'text-sm font-semibold text-slate-800',
  input:
    'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500',
  textarea:
    'min-h-32 w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100',
  select:
    'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100',
  button:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-[#2B245C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-indigo-900',
  secondaryButton:
    'inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400',
  dangerButton:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100',
  actions: 'flex flex-wrap items-center gap-2',
  tableWrap: 'overflow-x-auto rounded-lg border border-slate-200',
  table: 'min-w-full divide-y divide-slate-200 bg-white text-sm',
  th: 'bg-blue-50 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-blue-800',
  td: 'border-t border-slate-100 px-4 py-3 align-top text-slate-700',
  tr: 'transition hover:bg-blue-50/40',
  error: 'rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700',
  notice: 'whitespace-pre-line rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700',
  checkboxRow: 'flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-700',
  checkbox: 'mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500',
  tabs: 'mb-5 flex flex-wrap gap-2',
  tab:
    'rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700',
  activeTab: 'border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-700 hover:text-white',
  modeToggle: 'inline-flex rounded-lg border border-blue-100 bg-blue-50 p-1',
  modeButton: 'rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700',
  activeModeButton: 'bg-white text-blue-700 shadow-sm',
  publicShell: 'min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8',
  publicCard: 'mx-auto w-full max-w-4xl rounded-lg border border-blue-100 bg-white p-5 shadow-sm sm:p-7',
};

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
