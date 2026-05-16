import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Unlock, Upload } from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { QuickStats } from "../components/dashboard/QuickStats";
import { HistoryTable } from "../components/dashboard/HistoryTable";
import { useAuth } from "../hooks/useAuth";
import { useDemoState } from "../hooks/useDemoState";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { initiateVerificationPayment } from "../api/verification";
import { PaymentGate } from "../components/verification/PaymentGate";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    userRole,
    freeCredits,
    userEmail,
    selectPlan,
    consumeFreeCredit,
    resetToRegular,
  } = useDemoState();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [payingPlan, setPayingPlan] = useState<"pro" | "developer" | null>(
    null,
  );
  const [isStartingPayment, setIsStartingPayment] = useState(false);

  // Use data from user object (fetched from /profile)
  // Provide empty defaults if the backend hasn't sent them yet
  const stats = user?.stats || {
    total: 0,
    authentic: 0,
    suspicious: 0,
    highRisk: 0,
  };

  const history = user?.history || [];
  const totalVerifications =
    typeof stats.total === "number"
      ? stats.total
      : parseInt(String(stats.total).replace(/,/g, "")) || 0;
  const hasUnlimitedAccess = userRole === "pro" || userRole === "developer";
  const canUseUpload = hasUnlimitedAccess || freeCredits > 0;

  const handleUpgradePayment = async (plan: "pro" | "developer") => {
    if (!userEmail) return;

    setIsStartingPayment(true);
    try {
      const amount = plan === "pro" ? 1000 : 5000;
      const response = await initiateVerificationPayment(userEmail, amount);
      selectPlan(plan);
      setPayingPlan(plan);
      setPaymentUrl(response.checkout_url);
    } catch (error) {
      console.error("Failed to start payment:", error);
    } finally {
      setIsStartingPayment(false);
    }
  };

  if (paymentUrl && payingPlan) {
    return (
      <DashboardLayout>
        <PaymentGate
          titleOverride={
            payingPlan === "pro" ? "Pro Upgrade" : "Developer Upgrade"
          }
          priceOverride={payingPlan === "pro" ? "₦1,000" : "₦5,000"}
          documentCount={1}
          paymentUrl={paymentUrl}
          onPaymentInitiated={() => navigate("/payment-success")}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Top Header & Greeting */}
        <DashboardHeader user={user} demoRole={userRole} />

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-[0.2em]">
                Verification Access
              </p>
              <h2 className="text-xl font-bold text-on-surface">
                {canUseUpload ? "Certificate Upload Tool" : "Upgrade Required"}
              </h2>
            </div>
            <span className="text-xs font-bold text-on-surface-variant">
              Free Credits: {freeCredits}
            </span>
          </div>

          {canUseUpload ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded border border-outline-variant bg-surface-container-low p-4">
              <div className="flex items-center gap-3">
                <Unlock className="w-5 h-5 text-secondary" />
                <p className="text-sm text-on-surface">
                  Upload tool is unlocked for{" "}
                  {hasUnlimitedAccess
                    ? "unlimited verifications"
                    : "1 demo verification"}
                  .
                </p>
              </div>
              <Button
                variant="primary"
                className="h-11 px-6 font-bold"
                onClick={() => {
                  if (!hasUnlimitedAccess && freeCredits > 0) {
                    consumeFreeCredit();
                  }
                  navigate("/verify");
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Start Verification
              </Button>
            </div>
          ) : (
            <div className="space-y-4 rounded border border-outline-variant bg-surface-container-low p-4">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-error" />
                <p className="text-sm text-on-surface">
                  Your free credit is used up. Choose a plan to unlock access.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  variant="outlined"
                  className="h-11 font-bold"
                  disabled={isStartingPayment || !userEmail}
                  onClick={() => handleUpgradePayment("pro")}
                >
                  Pay Pro (₦1,000)
                </Button>
                <Button
                  variant="primary"
                  className="h-11 font-bold"
                  disabled={isStartingPayment || !userEmail}
                  onClick={() => handleUpgradePayment("developer")}
                >
                  Pay Developer (₦5,000)
                </Button>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="outlined"
              size="sm"
              className="h-9 text-[11px] font-bold"
              onClick={resetToRegular}
            >
              Reset to Regular (Demo)
            </Button>
          </div>
        </Card>

        {/* Core Metrics Grid */}
        <QuickStats stats={stats} />

        {/* Main Data Table */}
        <div className="pt-8">
          <HistoryTable
            historyItems={history}
            totalCount={totalVerifications}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
