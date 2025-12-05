/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

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
