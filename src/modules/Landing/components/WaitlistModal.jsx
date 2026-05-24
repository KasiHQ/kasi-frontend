import React, { useState } from "react";
import { X, ArrowRight, Check, Send } from "lucide-react";
import api from "../../../api/axios";

export const WaitlistModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    category: "",
    heard_about: "",
    runs_online_biz: "",
    commerce_platform: "",
    customer_spend: "",
    business_orders: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1 = Contact Info, 2 = Commerce Profile

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone_number") {
      const numericVal = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericVal }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone_number || !formData.category || !formData.heard_about) {
      setError("Please fill out all required fields to continue.");
      return;
    }
    setError("");
    setCurrentStep(2);
  };

  // Determine if this user is classified as a business/vendor
  const isBusinessUser = 
    formData.runs_online_biz === "Yes" || 
    formData.category === "product_vendor" || 
    formData.category === "service_provider";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Build payload making sure to only submit spend/orders appropriately
    const payload = {
      ...formData,
      customer_spend: !isBusinessUser ? formData.customer_spend : "None",
      business_orders: isBusinessUser ? formData.business_orders : "None",
    };

    if (!payload.runs_online_biz || !payload.commerce_platform) {
      setError("Please fill out all fields on this step.");
      setLoading(false);
      return;
    }

    if (isBusinessUser && !payload.business_orders) {
      setError("Please specify your monthly orders/bookings volume.");
      setLoading(false);
      return;
    }

    if (!isBusinessUser && !payload.customer_spend) {
      setError("Please specify your average monthly online shopping budget.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/api/auth/waitlist", payload);
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
                  Join Kasi Beta Waitlist.
                </h3>
                <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-normal font-medium mt-1">
                  Be the first to automate your sales, negotiations, and payments. Tell us about yourself to customize your early access!
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
                  /* Step 1: Contact & Categorization */
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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

                      {/* WhatsApp Phone Number */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">WhatsApp Phone Number</label>
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Category */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">What describes you best?</label>
                        <select
                          name="category"
                          required
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                        >
                          <option value="">Select category...</option>
                          <option value="product_vendor">I sell physical products</option>
                          <option value="service_provider">I offer services/bookings</option>
                          <option value="professional">I am a professional</option>
                          <option value="investor">I am an investor</option>
                          <option value="regular_user">Just regular folks / buyer</option>
                        </select>
                      </div>

                      {/* Heard About Kasi */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">How did you hear about Kasi?</label>
                        <select
                          name="heard_about"
                          required
                          value={formData.heard_about}
                          onChange={handleChange}
                          className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                        >
                          <option value="">Select option...</option>
                          <option value="Social Media">Social Media (Twitter, IG, TikTok)</option>
                          <option value="Friend">Friend or Colleague</option>
                          <option value="Ad">Online Advertisement</option>
                          <option value="Search">Search Engine (Google, Bing)</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Step 2: Commerce & Dynamic Profile */
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Runs Online Business */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">Do you run an online business?</label>
                        <select
                          name="runs_online_biz"
                          required
                          value={formData.runs_online_biz}
                          onChange={handleChange}
                          className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                        >
                          <option value="">Select choice...</option>
                          <option value="Yes">Yes, I do</option>
                          <option value="No">No, I don't</option>
                        </select>
                      </div>

                      {/* Commerce Platform */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">Main platform for your transactions?</label>
                        <select
                          name="commerce_platform"
                          required
                          value={formData.commerce_platform}
                          onChange={handleChange}
                          className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                        >
                          <option value="">Select platform...</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Instagram">Instagram</option>
                          <option value="TikTok">TikTok</option>
                          <option value="Website">Website (Shopify, WooCommerce, etc)</option>
                          <option value="Physical Store">Physical Store</option>
                          <option value="None">None / Not Applicable</option>
                        </select>
                      </div>
                    </div>

                    {/* Conditional Spend vs Orders field */}
                    {isBusinessUser ? (
                      /* Business Field: Orders */
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">Average orders or bookings received monthly?</label>
                        <select
                          name="business_orders"
                          required
                          value={formData.business_orders}
                          onChange={handleChange}
                          className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                        >
                          <option value="">Select orders range...</option>
                          <option value="Under 10">Under 10 orders / month</option>
                          <option value="10-50">10 to 50 orders / month</option>
                          <option value="50-200">50 to 200 orders / month</option>
                          <option value="Above 200">More than 200 orders / month</option>
                        </select>
                      </div>
                    ) : (
                      /* Customer Field: Budget */
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-black dark:text-white tracking-wider uppercase">Average monthly budget on online shopping?</label>
                        <select
                          name="customer_spend"
                          required
                          value={formData.customer_spend}
                          onChange={handleChange}
                          className="w-full bg-white dark:bg-[#121A15] border-[2px] border-black px-4 py-2.5 rounded-xl text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1A7A4A]/25 transition-all shadow-[2px_2px_0px_#000]"
                        >
                          <option value="">Select spend range...</option>
                          <option value="Under ₦10k">Under ₦10,000 / month</option>
                          <option value="₦10k - ₦50k">₦10,000 - ₦50,000 / month</option>
                          <option value="₦50k - ₦200k">₦50,000 - ₦200,000 / month</option>
                          <option value="Above ₦200k">Above ₦200,000 / month</option>
                        </select>
                      </div>
                    )}
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
                    <span>{loading ? "Joining..." : currentStep === 1 ? "Next Step" : "Join Waitlist"}</span>
                    <ArrowRight size={16} strokeWidth={3.5} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Success State - Immediate WhatsApp Invite */
            <div className="py-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-[#1A7A4A]/10 border-[2px] border-[#1A7A4A] text-[#1A7A4A] rounded-full flex items-center justify-center mx-auto shadow-[3px_3px_0px_rgba(26,122,74,0.15)]">
                <Check size={32} strokeWidth={3} />
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black text-black dark:text-white font-bricolage tracking-tight leading-none">
                  Welcome to Kasi! 🎉
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 max-w-sm mx-auto leading-relaxed font-semibold">
                  You are officially on the exclusive beta waitlist. Now, join our active WhatsApp group immediately to connect with the team and get priority access!
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="https://chat.whatsapp.com/H8Gays3ZzkUIZdex99WeKD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full py-4 bg-[#25D366] hover:bg-[#20ba59] text-white border-[2.5px] border-black font-black text-base rounded-xl transition-all shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[5.5px_5.5px_0px_#000] active:translate-y-[0px] items-center justify-center gap-2.5 cursor-pointer text-center no-underline"
                >
                  <Send size={18} className="fill-current" />
                  <span>Join WhatsApp Community</span>
                </a>
              </div>

              <button
                onClick={onClose}
                className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white underline block mx-auto cursor-pointer bg-transparent border-0"
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
