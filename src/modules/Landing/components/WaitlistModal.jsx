import React, { useState } from "react";
import { X, ArrowRight, Check, Send } from "lucide-react";
import api from "../../../api/axios";

export const WaitlistModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    business_name: "",
    primary_platform: "",
    sales_volume: "",
    biggest_struggle: "",
    game_changer_feature: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1 = Core Info, 2 = Discovery

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone_number") {
      // Keep only numbers
      const numericVal = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericVal }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone_number || !formData.business_name || !formData.primary_platform) {
      setError("Please fill out all fields on this step.");
      return;
    }
    setError("");
    setCurrentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/api/auth/waitlist", formData);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to join waitlist. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm select-none font-sans">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#ECFDF3] dark:bg-[#0B150E] border-[3px] border-black rounded-[24px] shadow-[8px_8px_0px_#000] z-10 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        
        {/* Header decoration banner */}
        <div className="bg-[#1A7A4A] h-3 border-b-[3px] border-black w-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white dark:bg-black hover:bg-neutral-100 border-[1.5px] border-black rounded-full transition-all shadow-[2px_2px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-y-[0px] cursor-pointer text-black dark:text-white"
        >
          <X size={16} strokeWidth={3} />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {!success ? (
            <>
              {/* Form Heading */}
              <div className="mb-6 space-y-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#D4F263] border-[1.5px] border-black text-black text-[10px] font-black uppercase tracking-wider rounded-full shadow-[1.5px_1.5px_0px_#000]">
                  Get Early Access
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-black dark:text-white font-bricolage tracking-tight mt-1.5 leading-none">
                  Join the Future of Social Commerce.
                </h3>
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-normal font-medium">
                  Be the first to automate your sales, handle negotiations, and close deals effortlessly with Kasi. Join the waitlist and get an invite to our exclusive merchant community.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-[1.5px] border-red-500 rounded-xl text-xs font-bold text-center">
                  {error}
                </div>
              )}

              {/* Progress Steps */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`h-2 flex-1 rounded-full border border-black transition-colors ${currentStep >= 1 ? "bg-[#1A7A4A]" : "bg-white"}`} />
                <div className={`h-2 flex-1 rounded-full border border-black transition-colors ${currentStep >= 2 ? "bg-[#1A7A4A]" : "bg-white"}`} />
              </div>

              <form onSubmit={currentStep === 1 ? handleNext : handleSubmit} className="space-y-4">
                
                {currentStep === 1 ? (
                  /* Step 1: Core Fields */
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Bolaji Durojaiye"
                        className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. you@example.com"
                        className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* WhatsApp Number */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">WhatsApp Number</label>
                        <input
                          type="tel"
                          name="phone_number"
                          required
                          value={formData.phone_number}
                          onChange={handleChange}
                          placeholder="e.g. 08123456789"
                          className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                        />
                      </div>

                      {/* Business Name */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">Business Name</label>
                        <input
                          type="text"
                          name="business_name"
                          required
                          value={formData.business_name}
                          onChange={handleChange}
                          placeholder="e.g. Kasi Store"
                          className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                        />
                      </div>
                    </div>

                    {/* Primary Selling Platform */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">Primary Selling Platform</label>
                      <select
                        name="primary_platform"
                        required
                        value={formData.primary_platform}
                        onChange={handleChange}
                        className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                      >
                        <option value="">Select platform...</option>
                        <option value="Instagram">Instagram</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  /* Step 2: Discovery & Game-changer Feedback */
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Monthly Sales Volume */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">Monthly Sales Volume (Optional)</label>
                        <select
                          name="sales_volume"
                          value={formData.sales_volume}
                          onChange={handleChange}
                          className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                        >
                          <option value="">Select range...</option>
                          <option value="0 - 50k">0 - 50k NGN</option>
                          <option value="50k - 200k">50k - 200k NGN</option>
                          <option value="200k+">200k+ NGN</option>
                          <option value="I’m just starting">I'm just starting</option>
                        </select>
                      </div>

                      {/* Biggest Struggle */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">Biggest Sales Struggle</label>
                        <select
                          name="biggest_struggle"
                          value={formData.biggest_struggle}
                          onChange={handleChange}
                          className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                        >
                          <option value="">Select struggle...</option>
                          <option value="Responding to DMs">Responding to DMs</option>
                          <option value="Closing deals">Closing deals</option>
                          <option value="Tracking orders/invoicing">Tracking orders/invoicing</option>
                          <option value="Managing inventory">Managing inventory</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Game-changing feature */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">What feature would change the game for you?</label>
                      <textarea
                        name="game_changer_feature"
                        rows="3"
                        value={formData.game_changer_feature}
                        onChange={handleChange}
                        placeholder="Tell us what tool or feature you need most..."
                        className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000] resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border-[2px] border-black bg-white dark:bg-black text-black dark:text-white font-bold text-sm rounded-xl transition-all shadow-[2px_2px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#000] active:translate-y-[0px] cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-[#1A7A4A] hover:bg-[#15603A] text-white border-[2.5px] border-black font-black text-sm rounded-xl transition-all shadow-[3px_3px_0px_#000] hover:translate-y-[-1px] hover:shadow-[4.5px_4.5px_0px_#000] active:translate-y-[0px] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{loading ? "Joining..." : currentStep === 1 ? "Next Step" : "Get Early Access"}</span>
                    <ArrowRight size={16} strokeWidth={3.5} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Success State - Immediate Gratification WhatsApp Invite */
            <div className="py-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-[#1A7A4A]/10 border-[2px] border-[#1A7A4A] text-[#1A7A4A] rounded-full flex items-center justify-center mx-auto shadow-[3px_3px_0px_rgba(26,122,74,0.15)]">
                <Check size={32} strokeWidth={3} />
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black text-black dark:text-white font-bricolage tracking-tight leading-none">
                  Welcome to the Family! 🎉
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 max-w-sm mx-auto leading-relaxed font-semibold">
                  You are officially on the exclusive beta waitlist. Now, join our active merchants group immediately to align, trade tips, and stay updated.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="https://chat.whatsapp.com/H8Gays3ZzkUIZdex99WeKD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-white border-[2.5px] border-black font-black text-base rounded-xl transition-all shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[5.5px_5.5px_0px_#000] active:translate-y-[0px] items-center justify-center gap-2.5 cursor-pointer text-center"
                >
                  <Send size={18} className="fill-current" />
                  <span>Join WhatsApp Community</span>
                </a>
              </div>

              <button
                onClick={onClose}
                className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white underline block mx-auto cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
