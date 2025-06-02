"use client";
import { useAppTheme } from "@/hooks/use-theme";
import { themes, accentColors } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export default function AppearanceSettings() {
  const { currentTheme, accentColor, setTheme, setAccentColor, glowEffects, setGlowEffects, animations, setAnimations } = useAppTheme();
  return (
    <div className="p-6 bg-background/30 backdrop-blur-sm min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-primary neon-text">Appearance</h2>
      <div className="max-w-3xl space-y-8">
        <div>
          <h3 className="font-medium text-primary mb-4">Theme</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(themes).map(([key, theme]) => (
              <div
                key={key}
                className={cn(
                  "bg-card/30 backdrop-blur-sm p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/60",
                  currentTheme === key ? "border-2 border-primary/60 neon-glow" : "border border-border"
                )}
                onClick={() => setTheme(key)}
              >
                <div className={cn("h-20 rounded mb-2 bg-gradient-to-br", theme.preview)}></div>
                <p className="text-center text-sm text-primary font-medium">{theme.name}</p>
                <p className="text-center text-xs text-muted-foreground mt-1">{theme.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-primary mb-4">Accent Color</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(accentColors).map(([key, color]) => (
              <div
                key={key}
                className={cn(
                  "relative h-12 w-12 rounded-full cursor-pointer transition-all hover:scale-110",
                  `bg-gradient-to-br ${color.gradient}`,
                  accentColor === key && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
                onClick={() => setAccentColor(key)}
                title={color.name}
              >
                {accentColor === key && (
                  <div className="absolute inset-0 rounded-full bg-primary/20 neon-glow"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-primary mb-4">Visual Effects</h3>
          <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Glow Effects</h4>
                <p className="text-sm text-muted-foreground">Enable neon glow effects throughout the interface</p>
              </div>
              <Switch checked={glowEffects} onCheckedChange={setGlowEffects} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Interface Animations</h4>
                <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
              </div>
              <Switch checked={animations} onCheckedChange={setAnimations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
