import { Building2, Users, Award, Target, Shield, Clock } from 'lucide-react'

export default function SobrePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sobre a <span className="text-primary">Nix Imóveis</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transformamos o mercado imobiliário com tecnologia, confiança e excelência no atendimento. 
            Há mais de 10 anos conectando pessoas aos seus sonhos.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10.000+</div>
            <div className="text-gray-300">Imóveis Vendidos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">15.000+</div>
            <div className="text-gray-300">Clientes Satisfeitos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">12+</div>
            <div className="text-gray-300">Anos de Experiência</div>
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="card p-8">
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-white">Nossa Missão</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Facilitar o processo de compra e venda de imóveis, oferecendo uma plataforma intuitiva, 
              segura e eficiente que conecte pessoas aos seus lares ideais, com transparência e 
              compromisso em cada etapa do caminho.
            </p>
          </div>
          
          <div className="card p-8">
            <div className="flex items-center mb-4">
              <Award className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-white">Nossa Visão</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Ser a principal referência no mercado imobiliário brasileiro, reconhecidos pela 
              inovação tecnológica, excelência no atendimento e por transformar sonhos em realidade 
              através de soluções imobiliárias acessíveis e de qualidade.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Confiança</h3>
              <p className="text-gray-300">
                Relações construídas na base da honestidade, transparência e compromisso com nossos clientes.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Atendimento Humanizado</h3>
              <p className="text-gray-300">
                Cada cliente é único. Oferecemos atenção personalizada e soluções adequadas às suas necessidades.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Qualidade</h3>
              <p className="text-gray-300">
                Seleção rigorosa dos imóveis e padrões elevados de qualidade em todos os nossos serviços.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Agilidade</h3>
              <p className="text-gray-300">
                Processos otimizados e tecnologia avançada para resultados rápidos e eficientes.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Excelência</h3>
              <p className="text-gray-300">
                Busca constante pela superação e melhoria contínua em tudo o que fazemos.
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Inovação</h3>
              <p className="text-gray-300">
                Uso de tecnologia de ponta para revolucionar a experiência de compra e venda de imóveis.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Nossa Equipe</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Profissionais altamente qualificados e dedicados, prontos para ajudar você a encontrar o imóvel perfeito.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-12 h-12 text-dark" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Corretores Especializados</h3>
              <p className="text-gray-300">
                Equipe com vasta experiência no mercado imobiliário e conhecimento profundo da região.
              </p>
            </div>
            
            <div className="card p-6">
              <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-12 h-12 text-dark" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Suporte Jurídico</h3>
              <p className="text-gray-300">
                Assessoria completa para garantir segurança e transparência em todas as transações.
              </p>
            </div>
            
            <div className="card p-6">
              <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="w-12 h-12 text-dark" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Equipe Tecnológica</h3>
              <p className="text-gray-300">
                Profissionais inovadores que mantêm nossa plataforma sempre atualizada e funcional.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-primary bg-opacity-10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para encontrar seu imóvel dos sonhos?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Entre em contato conosco e deixe nossa equipe cuidar de tudo com profissionalismo e dedicação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/imoveis" 
              className="btn-primary text-center inline-block"
            >
              Ver Imóveis
            </a>
            <a 
              href="/contato" 
              className="btn-secondary text-center inline-block"
            >
              Fale Conosco
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
