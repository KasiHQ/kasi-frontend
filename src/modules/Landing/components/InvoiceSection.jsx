import React from "react";

export const InvoiceSection = () => {
  return (
    <section
      id="invoices"
      className="w-full py-[100px] bg-[#F5F5F0] border-b-[1.5px] border-[#E5E5E5] relative select-none"
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
        
        {/* Top 2-Column Split: Mockup Panel Left | Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column — Phone Mockup Panel */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:order-1 order-2">
            {/* Rectangular green panel */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] bg-[#1A7A4A] rounded-2xl flex items-center justify-center p-8 border-[1.5px] border-black shadow-[6px_6px_0px_#0A0A0A] overflow-visible">
              <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none rounded-2xl" />
                           {/* Phone screen showing real invoice details */}
              <div className="w-[175px] h-[320px] bg-white rounded-[24px] border-[3px] border-black shadow-[3px_3px_0px_#0A0A0A] flex flex-col overflow-hidden transform rotate-[3deg] hover:rotate-0 transition-transform duration-500 z-10 relative">
                {/* Notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2 bg-black rounded-full z-30" />
                {/* Image */}
                <img 
                  src="/images/invoice-details-mobile.jpg" 
                  alt="Real customer paid invoice details" 
                  className="w-full h-full object-cover select-none pt-1" 
                />
              </div>

              {/* Mobile Phone Mockup Overlay - Receipt */}
              <div className="absolute -bottom-8 -right-4 w-[160px] h-[290px] bg-[#0E3924] rounded-[24px] border-[3px] border-black shadow-[4px_4px_0px_#0A0A0A] flex flex-col overflow-hidden transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 z-20 select-none">
                {/* Notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2 bg-black rounded-full z-30" />
                {/* Image */}
                <img 
                  src="/receipt.png" 
                  alt="Kasi AI Transaction Receipt" 
                  className="w-full h-full object-cover select-none pt-1" 
                />
              </div>
              
              {/* Floating Props */}
              
              {/* 1. Payment confirmation badge (checkmark + ₦2,100) */}
              <div className="absolute -bottom-6 -left-6 bg-white border-[1.5px] border-black rounded-[16px] p-3 shadow-[4px_4px_0px_#0A0A0A] flex items-center gap-2.5 z-20 transform -rotate-[3deg] font-sans">
                <div className="w-7 h-7 rounded-full bg-[#1A7A4A] border border-black flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-left leading-none">
                  <div className="text-[8px] font-black text-grey-500 uppercase tracking-widest pl-0.5">Paid Successfully</div>
                  <div className="text-xs font-black text-black mt-0.5 font-bricolage">₦2,100.00</div>
                </div>
              </div>

              {/* 2. Receipt paper, rotated slightly */}
              <div className="absolute -top-10 -right-6 bg-white border-[1.5px] border-black p-2.5 w-24 rounded-lg shadow-[3px_3px_0px_#0A0A0A] z-20 transform rotate-[12deg] text-black text-[7.5px] font-mono leading-tight text-left">
                <div className="text-center font-bold border-b border-dashed border-black pb-1 mb-1">RECEIPT</div>
                <div className="flex justify-between"><span>Bitter Kola</span><span>x2</span></div>
                <div className="flex justify-between mb-1"><span>Total</span><span>₦2,100</span></div>
                <div className="text-center bg-[#E8F5EE] text-[#1A7A4A] border border-[#1A7A4A] py-0.5 rounded-[4px] font-bold text-[6.5px] uppercase">PAID</div>
              </div>

            </div>
          </div>

          {/* Right Column — Text & Highlights */}
          <div className="lg:col-span-7 space-y-6 text-left lg:order-2 order-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F5EE] border-[1.5px] border-[#1A7A4A] text-[#1A7A4A] text-xs font-black uppercase tracking-wider rounded-full">
              <span>02_Invoicing & Payments</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#0A0A0A] font-bricolage">
              Secure Payments,<br />
              <span className="text-[#1A7A4A]">zero code.</span>
            </h2>
            
            <p className="text-base md:text-lg text-grey-700 max-w-xl leading-relaxed font-sans font-medium">
              Never type out your bank details again or chase screenshots of transfers. Kasi automatically generates secure checkout links and confirms payments inside chats — instantly. Customers can pay via card or bank transfer, and payouts are routed straight to your linked bank account. Only standard payment processing fees apply.
            </p>

            {/* 2 Side-by-Side Highlight Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              {/* Block 1 (Light) */}
              <div className="bg-white border-[1.5px] border-[#E5E5E5] rounded-2xl p-6 flex flex-col gap-3 hover:border-black hover:shadow-[4px_4px_0px_#0A0A0A] transition-all duration-300 font-sans">
                <div className="text-[10px] font-black text-grey-500 uppercase tracking-widest leading-none">STAY IN CONTROL</div>
                <h4 className="text-lg font-bold text-[#0A0A0A] leading-tight font-bricolage">Your cash, every step of the way</h4>
                <p className="text-[14px] text-grey-700 leading-relaxed font-medium">
                  Track income and see your savings update in real time as automated orders close.
                </p>
              </div>

              {/* Block 2 (Dark Card) */}
              <div className="bg-[#0F1F0F] text-white border-[1.5px] border-black rounded-2xl p-8 flex flex-col gap-4 shadow-[4px_4px_0px_#0A0A0A] hover:translate-y-[-4px] transition-all duration-300 font-sans">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-wider bg-[#1A7A4A]/30 text-[#D4F263] border border-[#1A7A4A] leading-none">
                    NEW RELEASE
                  </span>
                </div>
                <h4 className="text-lg font-bold leading-tight font-bricolage">Your Conversational Finance Command Centre</h4>
                <p className="text-[14px] text-grey-200/80 leading-relaxed font-medium">
                  Link your bank details and connect Paystack. Kasi handles invoice generation and split payouts automatically.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
