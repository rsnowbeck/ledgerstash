import avatar1 from "@/assets/ai-avatar-option-1.png";
import avatar2 from "@/assets/ai-avatar-option-2.png";
import avatar3 from "@/assets/ai-avatar-option-3.png";
import avatar4 from "@/assets/ai-assistant-avatar.png";

export default function AvatarPreview() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold text-foreground mb-8 text-center">Pick Your AI Assistant Avatar</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {[
          { src: avatar1, label: "Option 1 — 3D Pixar" },
          { src: avatar2, label: "Option 2 — Geometric Flat" },
          { src: avatar3, label: "Option 3 — Shield Robot" },
          { src: avatar4, label: "Option 4 — Indigo Flat" },
        ].map((opt, i) => (
          <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-xl border bg-card">
            <img src={opt.src} alt={opt.label} className="w-40 h-40 object-contain" />
            <p className="text-sm font-medium text-foreground text-center">{opt.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
