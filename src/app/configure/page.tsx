import ConfiguratorForm from "@/components/forms/configurator-form";
export default function ConfigurePage({ searchParams }: { searchParams: { productId?: string, type?: string } }) {
  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-8 pl-2 border-l-4 border-blue-600">
          <h1 className="text-2xl font-bold text-slate-900">Custom Box Configurator</h1>
          <p className="text-sm text-slate-500">Define your specs to get an accurate manufacturing quote.</p>
        </div>
        <ConfiguratorForm initialProductId={searchParams.productId} initialBoxType={searchParams.type} />
      </div>
    </div>
  );
}