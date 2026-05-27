import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, MessageSquare, Loader2, ShieldCheck } from 'lucide-react';
import api from '../../../api/axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);

  const reference = searchParams.get('reference') || searchParams.get('trxref');

  useEffect(() => {
    if (reference) {
      fetchInvoiceDetails();
    } else {
      setLoading(false);
      setError('No transaction reference provided.');
    }
  }, [reference]);

  const fetchInvoiceDetails = async () => {
    try {
      const res = await api.get(`/api/invoices/public/${reference}`);
      setInvoice(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch transaction details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background Decorative Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 max-w-md w-full text-center overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500" />

        {loading ? (
          <div className="flex flex-col items-center space-y-4 py-8">
            <Loader2 size={48} className="animate-spin text-primary" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Verifying Payment</h2>
            <p className="text-slate-400 text-sm">Please wait while we confirm your transaction...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center space-y-4 py-6">
            <div className="relative flex items-center justify-center mb-2">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center shadow-xs">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Payment Processed</h2>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Your payment is complete and has been securely received. You can now close this tab and return to your chat!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            {/* Animated checkmark circle */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 bg-green-100 dark:bg-green-950/30 rounded-full animate-ping opacity-75 duration-1000" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200 dark:shadow-none">
                <CheckCircle2 size={36} strokeWidth={2.5} />
              </div>
            </div>

            {/* Success Heading */}
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Payment Successful!</h2>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Invoice {invoice.reference}</p>
            </div>

            {/* Transaction Card */}
            <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4 text-left">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-sans">Paid To</span>
                <span className="font-bold text-slate-850 dark:text-slate-100 font-sans">{invoice.business_name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-sans">Customer</span>
                <span className="font-bold text-slate-850 dark:text-slate-100 font-sans">{invoice.customer_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-sans">Amount</span>
                <span className="font-black text-2xl text-emerald-600 dark:text-emerald-400 font-sans">
                  ₦{invoice.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3 pt-2">
              {invoice.whatsapp_link ? (
                <a
                  href={invoice.whatsapp_link}
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 dark:shadow-none transition-all flex items-center justify-center gap-2 text-sm hover:scale-[1.02] cursor-pointer"
                >
                  <MessageSquare size={18} fill="currentColor" className="text-white border-none" />
                  Return to WhatsApp Chat
                </a>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-3.5 text-xs text-emerald-750 dark:text-emerald-400 font-semibold leading-relaxed font-sans">
                  You can now close this tab and return to your chat. Your payment is complete and the merchant has been notified!
                </div>
              )}
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-350 dark:text-slate-650 tracking-wider uppercase pt-4 font-sans">
              <ShieldCheck size={12} /> Securely processed by Kasi via Paystack
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
