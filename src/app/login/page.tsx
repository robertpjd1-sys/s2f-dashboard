"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [step, setStep] = useState<"login" | "mfa">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // Check for existing session that requires MFA
  useEffect(() => {
    async function checkExistingMfa() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: aal, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
          // MFA is enrolled but not verified
          const { data: factors } = await supabase.auth.mfa.listFactors();
          const totpFactor = factors?.totp?.[0];
          if (totpFactor) {
            setMfaFactorId(totpFactor.id);
            setStep("mfa");
          }
        } else if (aal && aal.currentLevel === 'aal2') {
          // Already fully verified, send to dashboard
          router.push("/morning-briefing");
        }
      }
    }
    checkExistingMfa();
  }, [supabase, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Check for MFA factors
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      
      if (factorsError) throw factorsError;

      const totpFactor = factors.totp[0];

      if (totpFactor) {
        setMfaFactorId(totpFactor.id);
        setStep("mfa");
      } else {
        router.push("/morning-briefing");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!mfaFactorId) throw new Error("No MFA factor found");

      const { data, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: mfaFactorId,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: data.id,
        code: mfaCode,
      });

      if (verifyError) throw verifyError;

      router.push("/morning-briefing");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid 2FA code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faf8] p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1 pb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#3d5a3e] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <LogIn className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-serif font-bold text-center text-slate-900">
            Sign into S2F
          </CardTitle>
          <CardDescription className="text-center text-slate-500 font-medium tracking-tight mt-2">
            Enter your credentials to access the property dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {step === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@s2f.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-slate-300 focus:border-[#3d5a3e] focus:ring-[#3d5a3e]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-slate-300 focus:border-[#3d5a3e] focus:ring-[#3d5a3e]"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-[#3d5a3e] hover:bg-[#2d422e] text-white font-bold text-base transition-all rounded-lg shadow-md hover:shadow-lg mt-4"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Continue"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleMfaVerify} className="space-y-4">
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-slate-500">
                    Enter the 6-digit code from your authenticator app.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  id="mfaCode"
                  type="text"
                  placeholder="000000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  required
                  autoFocus
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  className="h-14 text-center text-3xl font-bold tracking-[0.5em] border-slate-300 focus:border-[#3d5a3e] focus:ring-[#3d5a3e]"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-[#3d5a3e] hover:bg-[#2d422e] text-white font-bold text-base transition-all rounded-lg shadow-md hover:shadow-lg mt-2"
                disabled={loading || mfaCode.length !== 6}
              >
                {loading ? "Verifying..." : "Verify & Access"}
              </Button>
              <button
                type="button"
                onClick={() => setStep("login")}
                className="w-full text-sm text-slate-500 hover:text-[#3d5a3e] font-medium py-2"
              >
                Back to Login
              </button>
            </form>
          )}
        </CardContent>
        <CardFooter className="pb-8 pt-2 flex justify-center border-t border-slate-100 mt-6 bg-slate-50/50 rounded-b-xl">
          <p className="text-xs text-slate-400 font-medium">
            Protected by Supabase Identity & S2F Security
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
