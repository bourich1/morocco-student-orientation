'use client';

import { FileText, Database } from 'lucide-react';

export function SetupRequired() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-red-900/20 text-red-400 p-4 rounded-full mb-6">
        <Database size={48} className="text-red-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-100 mb-4 tracking-tight">
        Supabase Configuration Required
      </h1>
      <p className="text-lg text-slate-400 max-w-xl mb-8">
        This application requires a Supabase backend to function. To continue, you must set up your 
        database and provide the environment variables.
      </p>

      <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-6 shadow-sm text-left max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-100">
          <FileText className="text-blue-500" /> Setup Instructions
        </h2>
        
        <ol className="list-decimal pl-5 space-y-4 text-slate-300">
          <li>
            Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Supabase</a>.
          </li>
          <li>
            Go to the SQL Editor in your Supabase dashboard and run the contents of the <code>supabase-setup.sql</code> file located in the root of this app.
          </li>
          <li>
            Open the Settings in your AI Studio editor (bottom left or top right) and add these secrets:
            <ul className="list-disc pl-5 mt-2 space-y-1 font-mono text-sm bg-slate-900 border border-slate-800 p-3 rounded text-slate-200">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ul>
          </li>
          <li>
            For the admin dashboard, create a user in Supabase Auth (Authentication &gt; Users &gt; Add User) with an email and password.
          </li>
        </ol>
      </div>
    </div>
  );
}
