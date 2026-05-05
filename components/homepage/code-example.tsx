"use client"

import { useState } from "react"
import { Button } from "@/components/homepage/ui/button"
import { Check, Copy } from "lucide-react"

const codeExample = `import { S3BgUploader } from 'react-native-s3-bg-uploader';

// enqueue files
S3BgUploader.uploadFile(file1, "transfer1"); 
S3BgUploader.uploadFile(file2, "transfer1"); 

// start the upload
S3BgUploader.resume();

// Pause when needed
upload.pause();`

export function CodeExample() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="install" className="py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, intuitive API
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started with just a few lines of code
          </p>
        </div>

        <div className="relative rounded-xl border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-chart-4/50" />
              <div className="w-3 h-3 rounded-full bg-primary/50" />
            </div>
            <span className="text-xs text-muted-foreground font-mono">upload.ts</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Code */}
          <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
            <code className="text-muted-foreground">
              {codeExample.split("\n").map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell pr-4 text-right text-muted-foreground/50 select-none">
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {line.includes("import") && (
                      <span>
                        <span className="text-primary">import</span>
                        {line.replace("import", "").replace("from", "").split("'")[0]}
                        <span className="text-primary">from</span>
                        <span className="text-chart-2">{` '${line.split("'")[1]}'`}</span>
                        {line.endsWith(";") ? ";" : ""}
                      </span>
                    )}
                    {line.includes("//") && !line.includes("import") && (
                      <span className="text-muted-foreground/70">{line}</span>
                    )}
                    {line.includes("const") && (
                      <span>
                        <span className="text-primary">const</span>
                        {line.replace("const", "")}
                      </span>
                    )}
                    {line.includes("await") && (
                      <span>
                        <span className="text-primary">await</span>
                        {line.replace("await", "")}
                      </span>
                    )}
                    {line.includes("console.log") && (
                      <span>
                        {"    "}
                        <span className="text-chart-4">console</span>
                        <span className="text-muted-foreground">.log</span>
                        {line.split("console.log")[1]}
                      </span>
                    )}
                    {!line.includes("import") &&
                      !line.includes("//") &&
                      !line.includes("const") &&
                      !line.includes("await") &&
                      !line.includes("console.log") && (
                        <span className="text-foreground/80">{line}</span>
                      )}
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </section>
  )
}
