import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { analyzeContract } from './api/ai';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contractText, setContractText] = useState('');
  const [sector, setSector] = useState('General');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/signin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!contractText.trim()) {
      alert('Please enter a contract to analyze');
      return;
    }
    
    setAnalyzing(true);
    try {
      const result = await analyzeContract(contractText, sector);
      setAnalysisResult(result);

      
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResult({ error: 'Failed to analyze contract' });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-md border">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container space-y-6">
      <header className="header-bar panel panel--soft p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="logo-badge">
            <img src="/contractLensLogo.png" alt="ContractLens logo" className="logo-image" />
          </div>
          <div>
            <p className="text-xl font-bold">ContractLens</p>
            <p className="text-sm text-gray-600">See risk and fairness in plain English</p>
          </div>
        </div>
        {user && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="user-pill">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Signed in as</span>
              <span className="block font-semibold text-gray-900">{user.email}</span>
            </div>
            <button className="btn-ghost" onClick={handleSignOut}>Sign Out</button>
          </div>
        )}
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 panel panel--soft p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-3">Analyze a contract</h1>
            <p className="text-gray-600 leading-relaxed">
              Paste terms of service, leases, or vendor agreements. We highlight risk,
              fairness, and hidden implications so you can decide fast.
            </p>
          </div>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label htmlFor="sector" className="block font-semibold text-gray-900 mb-2">Sector</label>
              <select
                id="sector"
                className="input-field w-full disabled:bg-gray-50 disabled:cursor-not-allowed"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                disabled={analyzing}
              >
                <option value="Oil and gas business">Oil and gas business</option>
                <option value="Land sales and purchase">Land sales and purchase</option>
                <option value="House rentals contract">House rentals contract</option>
                <option value="General">General</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">We adjust the analysis to match the sector you choose.</p>
            </div>
            <div>
              <label htmlFor="contract-input" className="block font-semibold text-gray-900 mb-2">Paste your contract or terms of service</label>
              <textarea
                id="contract-input"
                className="textarea-field w-full font-mono text-sm resize-vertical disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Paste your contract text here..."
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                disabled={analyzing}
                rows={12}
              />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                type="submit"
                className="btn-primary"
                disabled={analyzing}
              >
                {analyzing ? 'Analyzing...' : 'Analyze Contract'}
              </button>
              <span className="text-sm text-gray-500 subtle">We never store your document.</span>
            </div>
          </form>
        </section>

        <aside className="panel p-6">
          <h2 className="text-2xl font-bold mb-3">What you will get</h2>
          <p className="text-gray-600 mb-5 leading-relaxed">
            ContractLens distills complex clauses into clear, actionable guidance.
          </p>
          <div className="space-y-4 mb-6">
            <div className="feature-card">
              <div className="feature-dot"></div>
              <span className="block font-bold text-gray-900">Plain-English summary</span>
              <span className="text-sm text-gray-600">Understand obligations without the legal haze.</span>
            </div>
            <div className="feature-card">
              <div className="feature-dot"></div>
              <span className="block font-bold text-gray-900">Risk highlights</span>
              <span className="text-sm text-gray-600">Spot clauses that shift liability or limit rights.</span>
            </div>
            <div className="feature-card">
              <div className="feature-dot"></div>
              <span className="block font-bold text-gray-900">Fairness score</span>
              <span className="text-sm text-gray-600">See how balanced the agreement feels overall.</span>
            </div>
            <div className="feature-card">
              <div className="feature-dot"></div>
              <span className="block font-bold text-gray-900">Hidden implications</span>
              <span className="text-sm text-gray-600">Surface the fine print that affects real outcomes.</span>
            </div>
          </div>
          <div className="callout">
            <span className="text-xs font-bold text-yellow-700 uppercase tracking-wide">Tip</span>
            <p className="text-sm text-gray-700 mt-1">For the best results, include the full agreement and any appendices.</p>
          </div>
        </aside>
      </main>

      {analysisResult && !analysisResult.error && (
        <section className="panel p-6 reveal">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold">Contract analysis</h2>
              <p className="text-gray-600">Highlights generated for quick review.</p>
            </div>
            <div className={`risk-pill ${
              analysisResult.risk_level.toLowerCase() === 'low' 
                ? 'bg-green-100 text-green-800' 
                : analysisResult.risk_level.toLowerCase() === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {analysisResult.risk_level} risk
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <section className="analysis-card">
              <h3 className="font-bold text-gray-900 mb-2">Summary</h3>
              <p className="text-gray-700 leading-relaxed">{analysisResult.summary}</p>
            </section>

            <section className="analysis-card">
              <h3 className="font-bold text-gray-900 mb-3">Fairness Score</h3>
              <div className="progress-shell">
                <div
                  className="progress-fill"
                  style={{ width: `${(analysisResult.fairness_score / 10) * 100}%` }}
                >
                  {analysisResult.fairness_score}/10
                </div>
              </div>
            </section>
          </div>

          {analysisResult.key_concerns && analysisResult.key_concerns.length > 0 && (
            <section className="mb-6">
              <h3 className="text-xl font-bold mb-4">Key Concerns</h3>
              <div className="space-y-4">
                {analysisResult.key_concerns.map((concern, index) => (
                  <div key={index} className="issue-card">
                    <h4 className="font-bold text-gray-900 mb-2">Clause: {concern.clause}</h4>
                    <p className="mb-1"><strong className="text-gray-900">Risk:</strong> <span className="text-gray-700">{concern.risk}</span></p>
                    <p className="mb-2"><strong className="text-gray-900">Impact:</strong> <span className="text-gray-700">{concern.impact}</span></p>
                    <span className={`severity-pill ${
                      concern.severity.toLowerCase() === 'low' 
                        ? 'bg-green-100 text-green-800' 
                        : concern.severity.toLowerCase() === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Severity: {concern.severity}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {analysisResult.hidden_implications && analysisResult.hidden_implications.length > 0 && (
            <section className="notice-card mb-6">
              <h3 className="font-bold text-gray-900 mb-2">Hidden Implications</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {analysisResult.hidden_implications.map((implication, index) => (
                  <li key={index}>{implication}</li>
                ))}
              </ul>
            </section>
          )}

          {analysisResult.user_should_be_aware_of && analysisResult.user_should_be_aware_of.length > 0 && (
            <section className="notice-card mb-6">
              <h3 className="font-bold text-gray-900 mb-2">What You Should Be Aware Of</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {analysisResult.user_should_be_aware_of.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="verdict-card mb-6">
            <h3 className="font-bold text-gray-900 mb-2">Final Verdict</h3>
            <p className="text-gray-700 leading-relaxed">{analysisResult.final_verdict}</p>
          </section>

       

       

         

          <div className="flex justify-end">
            <button
              className="btn-secondary"
              onClick={() => {
                setAnalysisResult(null);
                setContractText('');
              }}
            >
              Analyze Another Contract
            </button>
          </div>
        </section>
      )}

      {analysisResult?.error && (
        <div className="error-card panel p-6 flex items-center justify-between gap-4">
          <div>
            <strong className="block text-red-800 mb-1">We hit a snag.</strong>
            <p className="text-red-700">{analysisResult.error}</p>
          </div>
          <button
            onClick={() => {
              setAnalysisResult(null);
            }}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
