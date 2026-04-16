import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import InsightsPanel from '@/components/insights/InsightsPanel';
import ChatPanel from '@/components/chat/ChatPanel';

export default async function ViewPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: doc } = await supabase
    .from('documents')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!doc) notFound();

  const { data: insights } = await supabase
    .from('insights')
    .select('*')
    .eq('document_id', params.id)
    .single();

  const { data: chatHistory } = await supabase
    .from('chats')
    .select('role, content, created_at')
    .eq('document_id', params.id)
    .order('created_at', { ascending: true });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text truncate">{doc.name}</h1>
        <p className="text-text-dim text-sm mt-0.5">
          {doc.page_count ? `${doc.page_count} pages · ` : ''}
          {doc.char_count ? `${doc.char_count.toLocaleString()} characters` : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <InsightsPanel insights={insights} />
        <ChatPanel
          documentId={params.id}
          initialMessages={chatHistory ?? []}
        />
      </div>
    </div>
  );
}
