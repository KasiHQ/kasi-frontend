import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { WaitlistModal } from "../components/WaitlistModal";

// Modular Spec 01 & 02 Components
import { NewNav } from "../components/home/NewNav";
import { NewHero } from "../components/home/NewHero";
import { DemoVideoSection } from "../components/home/DemoVideoSection";
import { PositioningBand } from "../components/home/PositioningBand";
import { PillarsSection } from "../components/home/PillarsSection";
import { ChannelOrbit } from "../components/home/ChannelOrbit";
import { LiveProductProof } from "../components/home/LiveProductProof";
import { AudienceScroller } from "../components/home/AudienceScroller";
const JourneyScene = React.lazy(() => import("../components/journey/JourneyScene"));
import { HumanBand } from "../components/home/HumanBand";
import { MarketTeaser } from "../components/home/MarketTeaser";
import { FinalCtaSection } from "../components/home/FinalCtaSection";
import { GlobalFooter } from "../../../components/common/GlobalFooter";

const LandingPage = () => {
  const { user, loading, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleGoogleLogin = async (response) => {
    try {
      const loggedInUser = await loginWithGoogle(response.credential);
      if (loggedInUser?.is_admin) {
        navigate("/kasisalienceadministration");
      } else {
        if (!loggedInUser.onboarding_completed) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Google auto-login failed on landing page:", err);
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google && !user && !loading) {
      try {
        google.accounts.id.initialize({
          client_id: "418652112968-i6bv554036fq1p6stf6ujhsf5qkste3q.apps.googleusercontent.com",
          callback: handleGoogleLogin,
          auto_select: true,
        });

        // Trigger One Tap overlay
        google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log("One Tap not displayed on landing:", notification.getNotDisplayedReason());
          }
        });
      } catch (err) {
        console.error("Google One Tap init failed on landing:", err);
      }
    }
  }, [user, loading]);

  useEffect(() => {
    if (user && !loading) {
      if (user.is_admin) {
        navigate("/kasisalienceadministration");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-[#F6F8F3] text-[#141C17] font-poppins selection:bg-[#DBF361] selection:text-[#141C17] overflow-x-clip w-full relative">
      {/* Spec 01: Top Navigation */}
      <NewNav />

      {/* Spec 2.1: Hero + Partner Strip */}
      <NewHero />

      {/* World-Class Demo Explainer Video Section */}
      <DemoVideoSection />

      {/* Spec 2.2: Positioning Band (The One-Line Pitch) */}
      <PositioningBand />

      {/* Spec 2.3: The Three Pillars (It Sells, It Fulfils, It Grows) */}
      <PillarsSection />

      {/* Spec 12 / Task 1 Orbit: Channel Orbit (Between 2.3 and 2.4) */}
      <ChannelOrbit />

      {/* Spec 2.4: Live Product Proof (Real Dashboard Screenshots) */}
      <LiveProductProof />

      {/* Spec 2.5: Audience Scroller (5 High-Volume Categories) */}
      <AudienceScroller />

      {/* Spec 2.6: The Kasi User Journey (Interactive Scroll-Driven Motion Piece) */}
      <React.Suspense fallback={<div className="h-[330vh] bg-[#0B0F0C]" />}>
        <JourneyScene variant="landing" />
      </React.Suspense>

      {/* Spec 2.7: The Human Band (Warm Nigerian Merchant Photo + Quotes) */}
      <HumanBand />

      {/* Spec 2.8: Kasi Market Teaser (Shoppers Band) */}
      <MarketTeaser />

      {/* Spec 2.9: Final CTA (Typing Indicator Motif) */}
      <FinalCtaSection />

      {/* Spec 01: Global Footer (3 Columns + Official Sign-Off) */}
      <GlobalFooter />

      {/* Waitlist Modal (for lead capture if triggered) */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
