import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotificationPreferences from "@/components/NotificationPreferences";

export default function Preferences() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Email Preferences</h1>
            <p className="text-muted-foreground">
              Manage your email notification preferences and digest settings
            </p>
          </div>

          <NotificationPreferences email={email} onEmailChange={setEmail} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
