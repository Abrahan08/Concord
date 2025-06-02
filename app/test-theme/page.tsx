"use client"

import { useAppTheme } from "@/hooks/use-theme"
import { accentColors } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export default function TestThemePage() {
  const { accentColor, setAccentColor, currentTheme, setTheme } = useAppTheme()

  const themes = ['neon', 'dark', 'midnight', 'matrix', 'cyberpunk', 'sunset']

  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-3xl font-bold text-primary neon-text">Theme Test Page</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Current Theme: {currentTheme} | Accent Color: {accentColor}</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-primary mb-2">Themes</h3>
            <div className="flex gap-2 flex-wrap">
              {themes.map((theme) => (
                <Button
                  key={theme}
                  onClick={() => setTheme(theme)}
                  variant={currentTheme === theme ? "default" : "outline"}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-primary mb-2">Accent Colors</h3>
            <div className="flex gap-4 flex-wrap">
              {Object.entries(accentColors).map(([key, color]) => (
                <Button
                  key={key}
                  onClick={() => setAccentColor(key)}
                  variant={accentColor === key ? "default" : "outline"}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {color.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Comprehensive Test Elements</h2>
        
        {/* Color Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-card border border-primary rounded-lg">
            <h3 className="text-primary font-semibold mb-2">Primary Color Card</h3>
            <p className="text-muted-foreground">This card uses primary color for border and text.</p>
          </div>
          
          <div className="p-4 bg-secondary rounded-lg">
            <h3 className="text-secondary-foreground font-semibold mb-2">Secondary Color Card</h3>
            <p className="text-secondary-foreground/70">This card uses secondary color as background.</p>
          </div>
          
          <div className="p-4 bg-card border border-border rounded-lg neon-glow">
            <h3 className="neon-text font-semibold mb-2">Neon Glow Effect</h3>
            <p className="text-muted-foreground">This card has a neon glow effect.</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-primary">Button Variations</h3>
          <div className="flex gap-4 flex-wrap">
            <Button className="btn-accent">Accent Button</Button>
            <Button variant="outline" className="btn-accent-outline">Accent Outline</Button>
            <Button className="bg-primary text-primary-foreground">Primary Button</Button>
            <Button className="bg-secondary text-secondary-foreground">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
        </div>

        {/* Color Bars */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-primary">Color Bars & Gradients</h3>
          <div className="space-y-2">
            <div className="h-4 bg-primary rounded accent-glow"></div>
            <div className="h-4 bg-secondary rounded accent-glow-secondary"></div>
            <div className="h-4 bg-gradient-to-r from-primary to-secondary rounded"></div>
            <div className="h-4 bg-gradient-to-r from-accent/30 to-accent rounded"></div>
          </div>
        </div>

        {/* Text Effects */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-primary">Text Effects</h3>
          <div className="p-4 border-2 border-primary rounded-lg space-y-2">
            <p className="text-primary accent-text-glow font-semibold">
              Primary text with accent glow effect
            </p>
            <p className="neon-text-secondary font-medium">
              Secondary neon text effect
            </p>
            <p className="neon-text-accent font-medium">
              Accent neon text effect
            </p>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-primary">Interactive Elements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-card border border-primary/30 rounded-lg hover:border-primary/60 hover:bg-primary/10 transition-all cursor-pointer">
              <h4 className="text-primary font-medium">Hover Card</h4>
              <p className="text-muted-foreground text-sm">Hover to see color changes</p>
            </div>
            <div className="p-4 bg-secondary/20 border border-secondary/30 rounded-lg hover:border-secondary/60 hover:bg-secondary/30 transition-all cursor-pointer">
              <h4 className="text-secondary font-medium">Secondary Hover Card</h4>
              <p className="text-muted-foreground text-sm">Hover to see secondary colors</p>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-primary">Status Indicators</h3>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-primary">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-secondary">Away</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span className="text-destructive">Busy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
