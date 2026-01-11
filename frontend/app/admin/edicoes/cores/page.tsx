'use client'

export default function AdminCoresPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Cores</h1>
      <p className="text-gray-400">Em breve: personalização das cores do site.</p>

      <div className="card p-6 mt-6">
        <p className="text-gray-300">
          Próximo passo: criar um endpoint de configurações do site (ex: /api/settings) para salvar e aplicar cores.
        </p>
      </div>
    </div>
  )
}
