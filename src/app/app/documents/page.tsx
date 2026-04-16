import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import Badge from '@/components/ui/Badge';

type BadgeVariant = 'success' | 'accent' | 'warning' | 'error' | 'muted';

function statusBadge(status: string): { label: string; variant: BadgeVariant } {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    done:      { label: 'Done',       variant: 'success' },
    analyzing: { label: 'Analyzing',  variant: 'accent'  },
    parsing:   { label: 'Parsing',    variant: 'accent'  },
    uploading: { label: 'Uploading',  variant: 'warning' },
    error:     { label: 'Error',      variant: 'error'   },
  };
  return map[status] ?? { label: status, variant: 'muted' };
}

function fileIcon(type: string) {
  const color = type === 'pdf' ? 'text-red-400' : type === 'docx' ? 'text-blue-400' : 'text-text-dim';
  return (
    <div className={`w-9 h-9 rounded-lg bg-elevated border border-border flex items-center justify-center ${color}`}>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
  );
}

export default async function DocumentsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text mb-1">Documents</h1>
          <p className="text-text-dim text-sm">{documents?.length ?? 0} document{documents?.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/app/upload"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-base text-sm font-medium hover:bg-accent-dim transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New
        </Link>
      </div>

      {!documents || documents.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-border rounded-xl">
          <div className="w-14 h-14 rounded-xl bg-elevated border border-border flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-text font-medium mb-1">No documents yet</p>
          <p className="text-text-dim text-sm mb-4">Upload your first document to get started</p>
          <Link href="/app/upload" className="text-accent hover:text-accent-dim text-sm font-medium">
            Upload document →
          </Link>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-dim uppercase tracking-wide">Document</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-dim uppercase tracking-wide hidden sm:table-cell">Size</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-dim uppercase tracking-wide hidden md:table-cell">Uploaded</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-dim uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-dim uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {documents.map(doc => {
                const badge = statusBadge(doc.status);
                return (
                  <tr key={doc.id} className="hover:bg-elevated/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {fileIcon(doc.file_type)}
                        <div>
                          <p className="font-medium text-text truncate max-w-[200px]">{doc.name}</p>
                          <p className="text-xs text-muted uppercase">{doc.file_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-dim hidden sm:table-cell">
                      {(doc.file_size / 1024 / 1024).toFixed(1)} MB
                    </td>
                    <td className="px-4 py-3 text-text-dim hidden md:table-cell">
                      {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {doc.status === 'done' && (
                        <Link
                          href={`/app/view/${doc.id}`}
                          className="text-accent hover:text-accent-dim text-xs font-medium"
                        >
                          Open →
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
