"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import { ComponentProps, useCallback } from 'react';

type LinkProps = ComponentProps<typeof Link>;

export default function ProgressLink({ href, onClick, ...props }: LinkProps) {
  const pathname = usePathname();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const targetHref = typeof href === 'string' ? href : href.pathname || '';
      if (targetHref !== pathname) {
        NProgress.start();
      }
      
      if (onClick) {
        onClick(e);
      }
    },
    [href, pathname, onClick]
  );

  return <Link href={href} onClick={handleClick} {...props} />;
}
