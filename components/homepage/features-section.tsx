"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/homepage/ui/card"
import { Pause, Play, Moon, Link2, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: Moon,
    title: "True Background Uploads",
    description:
      "Uploads continue even when your app is backgrounded or the screen is locked. Native implementation for iOS and Android.",
  },
  {
    icon: Pause,
    title: "Pause & Resume",
    description:
      "Full control over your uploads. Pause when needed, resume exactly where you left off. Perfect for large files.",
  },
  {
    icon: Link2,
    title: "Presigned URL Support",
    description:
      "Direct uploads to S3 using presigned URLs. No need to proxy through your server. Secure and efficient.",
  },
  {
    icon: Shield,
    title: "S3 API Compatible",
    description:
      "Works with Amazon S3, MinIO, DigitalOcean Spaces, Backblaze B2, and any S3-compatible storage.",
  },
  {
    icon: Zap,
    title: "Multipart Uploads",
    description:
      "Large files are automatically split into parts for faster, more reliable uploads with automatic retry.",
  },
  {
    icon: Play,
    title: "Progress Tracking",
    description:
      "Real-time progress updates with bytes transferred, speed estimation, and time remaining calculations.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need for reliable uploads
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built from the ground up for React Native with native modules for iOS and Android,
            plus web support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/50 transition-colors duration-300"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
