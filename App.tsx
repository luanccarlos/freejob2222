import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { JobCard } from './components/JobCard';
import { JobMap } from './components/JobMap';
import { JobDetailModal } from './components/JobDetailModal';
import { Dashboard } from './pages/Dashboard';
import { api } from './services/mockStore';
import { User, Job, UserRole } from './types';
import { MapPin, Search, Map as MapIcon, List as ListIcon, ShieldCheck } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('HOME');
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    // Load initial jobs
    setJobs(api.getJobs());
  }, []);

  const handleLogin = (role: UserRole) => {
    try {
        const loggedUser = api.login(role);
        setUser(loggedUser);
        setCurrentPage('DASHBOARD');
    } catch (e) {
        alert("Erro ao logar");
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setCurrentPage('HOME');
  };

  const handleSearch = () => {
      setJobs(api.getJobs({ query: searchTerm, location: locationFilter }));
      setCurrentPage('JOBS');
  }

  // Render Logic
  const renderContent = () => {
    switch (currentPage) {
      case 'DASHBOARD':
        return user ? <Dashboard user={user} /> : <div className="text-center py-20">Faça login para acessar.</div>;
      
      case 'JOBS':
        return (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="relative md:col-span-1">
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Cargo, empresa..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative md:col-span-1">
                            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Cidade ou Bairro"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                             <button 
                                onClick={handleSearch}
                                className="bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 transition flex-grow"
                            >
                                Filtrar
                            </button>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setViewMode('LIST')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition ${viewMode === 'LIST' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}
                            >
                                <ListIcon size={16} /> Lista
                            </button>
                            <button 
                                onClick={() => setViewMode('MAP')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition ${viewMode === 'MAP' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}
                            >
                                <MapIcon size={16} /> Mapa
                            </button>
                        </div>
                    </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-4">Vagas Disponíveis ({jobs.length})</h2>
                
                {viewMode === 'MAP' ? (
                    <JobMap jobs={jobs} onJobClick={(job) => setSelectedJob(job)} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map(job => (
                            <JobCard 
                                key={job.id} 
                                job={job} 
                                user={user} 
                                onApplySuccess={() => {
                                    alert("Candidatura realizada! Verifique seu dashboard.");
                                }} 
                            />
                        ))}
                        {jobs.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                Nenhuma vaga encontrada com estes filtros.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );

      case 'LOGIN':
        return (
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Escolha seu perfil</h2>
                <p className="mb-8 text-gray-600">Para testar o MVP, selecione um dos perfis simulados abaixo:</p>
                
                <div className="space-y-4">
                    <button 
                        onClick={() => handleLogin('WORKER')}
                        className="w-full py-4 border-2 border-orange-100 hover:border-orange-500 rounded-xl flex items-center justify-center gap-3 transition group bg-white hover:bg-orange-50"
                    >
                        <div className="bg-orange-100 p-2 rounded-full group-hover:bg-orange-600 group-hover:text-white transition">
                            <UserIconWrapper />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-gray-800">Sou Trabalhador</div>
                            <div className="text-xs text-gray-500">Busco vagas temporárias</div>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleLogin('ESTABLISHMENT')}
                        className="w-full py-4 border-2 border-gray-200 hover:border-gray-500 rounded-xl flex items-center justify-center gap-3 transition group bg-white hover:bg-gray-50"
                    >
                        <div className="bg-gray-100 p-2 rounded-full group-hover:bg-gray-800 group-hover:text-white transition">
                             <BriefcaseWrapper />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-gray-800">Sou Estabelecimento</div>
                            <div className="text-xs text-gray-500">Quero contratar extras</div>
                        </div>
                    </button>

                     <button 
                        onClick={() => handleLogin('ADMIN')}
                        className="w-full py-2 mt-4 text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 transition"
                    >
                        <ShieldCheck size={14} /> Login Administrativo
                    </button>
                </div>
            </div>
        );

      case 'HOME':
      default:
        return (
            <div>
                {/* Hero Section */}
                <div className="text-center py-16 md:py-24">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Trabalho temporário, <span className="text-orange-600">sem complicação</span>.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                        Conectamos estabelecimentos a freelancers em segundos. Segurança jurídica, pagamentos rápidos e sistema de mérito.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setCurrentPage('JOBS')} className="px-8 py-4 bg-orange-600 text-white rounded-lg font-bold text-lg hover:bg-orange-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Encontrar Vagas
                        </button>
                        {!user && (
                            <button onClick={() => setCurrentPage('LOGIN')} className="px-8 py-4 bg-white text-orange-600 border border-orange-200 rounded-lg font-bold text-lg hover:bg-gray-50 transition">
                                Cadastrar Empresa
                            </button>
                        )}
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 py-12 border-t border-gray-200">
                    <div className="text-center p-6">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DollarSignWrapper />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Pagamento Garantido</h3>
                        <p className="text-gray-500">Receba logo após o job. Sistema de carteira virtual com saque via Pix.</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldWrapper />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Sem Vínculo</h3>
                        <p className="text-gray-500">Controle inteligente de frequência para segurança jurídica de ambos.</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <StarWrapper />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Meritocracia</h3>
                        <p className="text-gray-500">Bons profissionais ganham destaque e acesso às melhores oportunidades.</p>
                    </div>
                </div>
            </div>
        );
    }
  };

  return (
    <Layout 
        user={user} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout}
        currentPage={currentPage}
    >
      {renderContent()}

      {selectedJob && (
          <JobDetailModal 
            job={selectedJob} 
            user={user} 
            onClose={() => setSelectedJob(null)}
          />
      )}
    </Layout>
  );
}

// Icon Wrappers to avoid TSX issues in large blocks
const UserIconWrapper = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)
const BriefcaseWrapper = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
)
const DollarSignWrapper = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
)
const ShieldWrapper = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
)
const StarWrapper = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
)

export default App;