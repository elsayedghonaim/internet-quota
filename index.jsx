import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Smartphone, 
  RefreshCw, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  LogOut,
  Server,
  Signal,
  X
} from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = "https://elsayedghoonaim-internet-quota.hf.space";

// --- Components ---

const ProgressBar = ({ used, total }) => {
  if (!total || total === 0) return <div className="h-4 bg-gray-200 rounded-full w-full"></div>;
  
  const percentage = Math.max(0, Math.min(100, ((total - used) / total) * 100));
  
  // Color Logic
  let colorClass = "bg-green-500";
  if (percentage <= 10) colorClass = "bg-red-600 animate-pulse"; // Critical
  else if (percentage <= 25) colorClass = "bg-orange-500"; // Warning
  else if (percentage <= 50) colorClass = "bg-yellow-500"; // Caution
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
      <div 
        className={`${colorClass} h-4 transition-all duration-1000 ease-out`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const QuotaCard = ({ account, onDelete }) => {
  const isLandline = account.type === 'LANDLINE';
  const remain = account.remain_gb || 0;
  const total = account.total_gb || 0;
  const used = account.used_gb || 0;
  const percentLeft = total > 0 ? (remain / total) * 100 : 0;
  const isLow = percentLeft <= 10 && total > 0;

  return (
    <div className={`relative bg-white rounded-xl shadow-md border-l-4 p-5 hover:shadow-lg transition-shadow duration-300 ${isLow ? 'border-red-500' : 'border-blue-500'}`}>
      {isLow && (
        <div className="absolute top-2 right-2 text-red-500 flex items-center text-xs font-bold animate-pulse">
          <AlertTriangle size={14} className="mr-1" /> LOW QUOTA
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full ${isLandline ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
            {isLandline ? <Wifi size={24} /> : <Smartphone size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{account.name || 'Unnamed Account'}</h3>
            <p className="text-gray-500 text-sm font-mono tracking-wider">{account.identifier}</p>
          </div>
        </div>
        <button 
          onClick={() => onDelete(account.identifier)}
          className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
          title="Remove Account"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mb-2 flex justify-between text-sm text-gray-600 font-medium">
        <span>{remain.toFixed(1)} GB Remaining</span>
        <span>{total.toFixed(1)} GB Total</span>
      </div>

      <ProgressBar used={used} total={total} />
      
      <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
        <span>Exp: {account.expires_on ? account.expires_on.split(' ')[0] : 'N/A'}</span>
        <span>{account.offer_name || 'Loading...'}</span>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600 mx-auto">
            <Trash2 size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">{title}</h2>
          <p className="text-gray-600 mb-6 text-center">{message}</p>
          <div className="flex justify-center space-x-3">
             <button 
               onClick={onClose} 
               className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
             >
               Cancel
             </button>
             <button 
               onClick={onConfirm} 
               className="px-5 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium shadow-md transition-all flex items-center"
             >
               Delete
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddAccountModal = ({ isOpen, onClose, onAdd, loading }) => {
  const [formData, setFormData] = useState({
    type: 'LANDLINE',
    identifier: '',
    password: '',
    name: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Add New Connection</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Connection Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={() => setFormData({...formData, type: 'LANDLINE'})}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${formData.type === 'LANDLINE' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                <Wifi size={16} className="inline mr-2" /> Landline
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, type: 'WE_AIR'})}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${formData.type === 'WE_AIR' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                <Smartphone size={16} className="inline mr-2" /> WE Air
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.type === 'LANDLINE' ? 'Landline Number (e.g. 022...)' : 'Service Number (e.g. 015...)'}
            </label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="0200000000"
              value={formData.identifier}
              onChange={(e) => setFormData({...formData, identifier: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Password (My WE)
            </label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Secret123"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Home, Office, etc."
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? <RefreshCw className="animate-spin mr-2" /> : <Plus className="mr-2" />}
              Add Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LoginScreen = ({ onLogin, loading }) => {
  const [creds, setCreds] = useState({ username: 'admin', password: '' });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Signal size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Internet Quota Manager</h1>
          <p className="text-gray-500 mt-2">Sign in to manage your connections</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(creds); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text"
              value={creds.username}
              onChange={(e) => setCreds({...creds, username: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password"
              value={creds.password}
              onChange={(e) => setCreds({...creds, password: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow mt-4 transition-all flex justify-center"
          >
            {loading ? <RefreshCw className="animate-spin" /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [auth, setAuth] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  
  // Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Try to load auth from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('quota_auth');
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
  }, []);

  // Fetch data when auth is set
  useEffect(() => {
    if (auth) {
      fetchQuotas();
    }
  }, [auth]);

  const getHeaders = () => {
    const base64Creds = btoa(`${auth.username}:${auth.password}`);
    return {
      'Authorization': `Basic ${base64Creds}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchQuotas = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL.replace(/\/$/, '')}/quotas${force ? '?force_refresh=true' : ''}`;
      const res = await fetch(url, { headers: getHeaders() });
      
      if (!res.ok) {
        if (res.status === 401) {
          logout();
          throw new Error("Invalid Credentials");
        }
        throw new Error("Failed to fetch data");
      }
      
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddAccount = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL.replace(/\/$/, '')}/accounts`;
      const res = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error("Failed to add account. Check credentials or identifier.");
      
      await fetchQuotas(false); // Reload list
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const promptDelete = (identifier) => {
    setError(null);
    setDeleteTarget(identifier);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    const identifier = deleteTarget;
    setDeleteTarget(null); // Close modal
    
    // Optimistic update
    const prevAccounts = [...accounts];
    setAccounts(accounts.filter(a => a.identifier !== identifier));

    try {
      const url = `${API_BASE_URL.replace(/\/$/, '')}/accounts/${identifier}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      if (!res.ok) throw new Error("Failed to delete account");
    } catch (err) {
      setError(err.message);
      setAccounts(prevAccounts); // Revert on error
    }
  };

  const handleLogin = (creds) => {
    setAuth(creds);
    localStorage.setItem('quota_auth', JSON.stringify(creds));
  };

  const logout = () => {
    setAuth(null);
    setAccounts([]);
    localStorage.removeItem('quota_auth');
  };

  if (!auth) return <LoginScreen onLogin={handleLogin} loading={loading} />;

  // Group Accounts
  const landlines = accounts.filter(a => a.type === 'LANDLINE');
  const weAir = accounts.filter(a => ['WE_AIR', 'MOBILE'].includes(a.type));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-700">
            <Server size={24} />
            <h1 className="text-xl font-bold tracking-tight">NetQuota<span className="text-gray-400 font-light">Manager</span></h1>
          </div>
          
          <div className="flex items-center space-x-3">
             <button 
              onClick={() => fetchQuotas(true)} 
              disabled={refreshing}
              className={`p-2 rounded-full text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all ${refreshing ? 'animate-spin text-blue-600' : ''}`}
              title="Refresh Quotas"
            >
              <RefreshCw size={20} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow transition-all"
            >
              <Plus size={16} /> <span>Add</span>
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <button onClick={logout} className="text-gray-400 hover:text-red-500">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center animate-in slide-in-from-top-4">
             <AlertTriangle className="text-red-500 mr-3" />
             <p className="text-red-700 font-medium">{error}</p>
             <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X size={18}/></button>
          </div>
        )}

        {/* Loading State */}
        {loading && !refreshing && accounts.length === 0 && (
          <div className="text-center py-20">
            <RefreshCw className="animate-spin h-10 w-10 text-blue-300 mx-auto mb-4" />
            <p className="text-gray-400">Syncing with satellites...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && accounts.length === 0 && !error && (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl">
            <p className="text-gray-400 mb-4">No internet connections tracked yet.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-blue-600 font-bold hover:underline">Add your first account</button>
          </div>
        )}

        {/* Landlines Section */}
        {landlines.length > 0 && (
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Landlines</h2>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{landlines.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {landlines.map(acc => (
                <QuotaCard key={acc.identifier} account={acc} onDelete={promptDelete} />
              ))}
            </div>
          </section>
        )}

        {/* WE Air Section */}
        {weAir.length > 0 && (
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">WE Air (4G)</h2>
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">{weAir.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weAir.map(acc => (
                <QuotaCard key={acc.identifier} account={acc} onDelete={promptDelete} />
              ))}
            </div>
          </section>
        )}
      </main>

      <AddAccountModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddAccount}
        loading={loading}
      />

      <ConfirmModal 
        isOpen={!!deleteTarget}
        title="Remove Connection?"
        message={`Are you sure you want to delete ${deleteTarget}? This action cannot be undone.`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
      />
    </div>
  );

}
