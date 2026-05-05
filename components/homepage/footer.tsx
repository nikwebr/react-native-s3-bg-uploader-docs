import Image from 'next/image'
import logo from '../../icon.png'

export function Footer() {
  return (
    <footer id="docs" className="border-t border-border bg-card/30">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
      src={logo}
      width={35}
      height={35}
      alt="Logo"
    />
              <span className="font-semibold text-foreground">react-native-s3-bg-uploader</span>
            </div>
            <p className="mb-5 text-muted-foreground text-sm max-w-sm leading-relaxed">
              Seamless file uploads that continue even when your app goes to background. 
              Open source and community driven.
            </p>
            <a href="https://github.com/nikwebr/react-native-s3-bg-uploader" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
            </a>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Documentation</h3>
            <ul className="space-y-3">
              <li>
                <a href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Getting Started
                </a>
              </li>
              <li>
                <a href="/docs/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="https://github.com/nikwebr/react-native-s3-bg-uploader/tree/master/example" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Example App
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Community</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com/nikwebr/react-native-s3-bg-uploader/issues" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  GitHub Discussions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 react-native-s3-bg-uploader. MIT License.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://ysendit.com/imprint" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Imprint
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
