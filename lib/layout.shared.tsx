import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import Image from 'next/image';
import logo from '../icon.png';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: (
        <span className="flex flex-col leading-tight">
          <div className="flex items-center gap-2">
              <Image
      src={logo}
      width={35}
      height={35}
      alt="Logo"
    />
              <span className="font-semibold text-foreground">react-native-s3-bg-uploader</span>
            </div>
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
