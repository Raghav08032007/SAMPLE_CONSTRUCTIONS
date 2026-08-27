import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { Calculator, ArrowRight, Info, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function EstimatorPage() {
  const navigate = useNavigate();
  const [plotSize, setPlotSize] = useState<number>(2400);
  const [constructionType, setConstructionType] = useState<string>('residential');
  const [finishTier, setFinishTier] = useState<string>('standard');
  const [result, setResult] = useState<{ min: number; max: number; rateMin: number; rateMax: number } | null>(null);

  useEffect(() => {
    calculate();
  }, [plotSize, constructionType, finishTier]);

  const calculate = async () => {
    if (plotSize <= 0) return;
    try {
      const res = await apiClient.post('/estimator/calculate', {
        plot_size: plotSize,
        construction_type: constructionType,
        finish_tier: finishTier,
      });
      setResult({
        min: res.data.min_estimate,
        max: res.data.max_estimate,
        rateMin: res.data.rate_per_sqft_min,
        rateMax: res.data.rate_per_sqft_max,
      });
    } catch (err) {
      console.error('Estimator calculation error:', err);
    }
  };

  const handleProceedToQuote = () => {
    navigate('/contact', {
      state: {
        prefillPlotSize: plotSize,
        prefillProjectType: constructionType,
        prefillBudget: result ? `${formatCurrency(result.min)} – ${formatCurrency(result.max)}` : '',
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-wider font-semibold text-primary-500">Construction Budget Planning</span>
        <h1 className="text-4xl font-serif font-bold text-neutral-charcoal">Interactive Cost Estimator</h1>
        <p className="text-neutral-600">
          Calculate estimated construction costs based on your built-up area and desired architectural finish tier.
        </p>
      </div>

      {/* Main Estimator Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-8 rounded-architectural border border-neutral-concrete shadow-warm-lg">
        {/* Controls */}
        <div className="md:col-span-7 space-y-6">
          {/* Plot Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-neutral-600">
              <label>Built-Up Area / Plot Size (sq ft)</label>
              <span className="text-primary-600 font-bold text-base">{plotSize} sq ft</span>
            </div>
            <input
              type="range"
              min={600}
              max={15000}
              step={100}
              value={plotSize}
              onChange={(e) => setPlotSize(Number(e.target.value))}
              className="w-full accent-primary-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 font-medium">
              <span>600 sq ft</span>
              <span>7,500 sq ft</span>
              <span>15,000 sq ft</span>
            </div>
          </div>

          {/* Construction Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Construction Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'residential', label: 'Residential Villa' },
                { id: 'commercial', label: 'Commercial' },
                { id: 'renovation', label: 'Renovation' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setConstructionType(t.id)}
                  className={`py-3 px-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all border ${
                    constructionType === t.id
                      ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                      : 'bg-neutral-sand text-neutral-600 border-neutral-concrete hover:bg-neutral-concrete/40'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Finish Tier */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Architectural Finish Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'basic', label: 'Basic', desc: 'Standard flooring & fittings' },
                { id: 'standard', label: 'Standard', desc: 'Teak doors & Italian tiles' },
                { id: 'premium', label: 'Premium', desc: 'Marble, domotics & luxury' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setFinishTier(tier.id)}
                  className={`p-3 rounded-md text-left transition-all border ${
                    finishTier === tier.id
                      ? 'bg-primary-50 text-primary-700 border-primary-400 font-bold shadow-sm'
                      : 'bg-neutral-sand text-neutral-600 border-neutral-concrete hover:bg-neutral-concrete/40'
                  }`}
                >
                  <p className="text-xs uppercase font-bold">{tier.label}</p>
                  <p className="text-[10px] text-neutral-500 font-normal mt-0.5">{tier.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Display */}
        <div className="md:col-span-5 bg-neutral-charcoal text-neutral-sand p-6 rounded-architectural flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-primary-400">Estimated Cost Range</span>

            {result ? (
              <div className="space-y-2">
                <p className="text-3xl lg:text-4xl font-serif font-extrabold text-white">
                  {formatCurrency(result.min)} – {formatCurrency(result.max)}
                </p>
                <p className="text-xs text-neutral-400 font-medium">
                  Estimated rate: ₹{result.rateMin} – ₹{result.rateMax} / sq ft
                </p>
              </div>
            ) : (
              <p className="text-sm text-neutral-400">Calculating...</p>
            )}

            <div className="p-3 bg-neutral-800/80 rounded border border-neutral-700 text-[11px] text-neutral-400 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold text-white">
                <Info className="w-3.5 h-3.5 text-primary-400" />
                <span>Indicative Estimate</span>
              </div>
              <p>
                Includes structural foundation, RCC work, masonry, plumbing, electrical, and finish tier materials. Excludes land acquisition cost.
              </p>
            </div>
          </div>

          <button
            onClick={handleProceedToQuote}
            className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-architectural transition-colors shadow-warm flex items-center justify-center space-x-2 text-sm"
          >
            <span>Get Detailed Blueprint Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
