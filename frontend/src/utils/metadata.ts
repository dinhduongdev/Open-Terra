/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generatePageMetadata(
  titleKey: keyof typeof import('../../messages/en.json')['pageTitles']
): Promise<Metadata> {
  const t = await getTranslations('pageTitles');
  
  return {
    title: `Open-Terra - ${t(titleKey)}`,
    description: 'Open platform for smart city data',
  };
}
