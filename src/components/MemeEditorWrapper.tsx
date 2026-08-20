'use client';
import dynamic from 'next/dynamic';

const MemeEditor = dynamic(() => import('./MemeEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-[500px] h-[500px] bg-gray-200 animate-pulse flex items-center justify-center rounded-lg">
      <p className="text-gray-500">Loading Editor...</p>
    </div>
  ),
});

export default function MemeEditorWrapper({ templateUrl }: { templateUrl: string }) {
  return <MemeEditor templateUrl={templateUrl} />;
}
