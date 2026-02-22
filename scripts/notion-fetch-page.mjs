#!/usr/bin/env node
/**
 * Fetch a Notion page's title and block content via the Notion API.
 * Usage: node scripts/notion-fetch-page.mjs <page-id-or-url>
 * Requires NOTION_API_KEY in the environment (e.g. from .env).
 * Output: first line "TITLE: <title>", then block content as markdown-like text.
 */

const NOTION_VERSION = '2022-06-28';

function extractPageId(input) {
  const trimmed = (input || '').trim();
  if (!trimmed) return null;
  // Already a UUID (with dashes)
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed))
    return trimmed;
  // 32 hex chars without dashes
  const noDashes = trimmed.replace(/-/g, '');
  if (/^[0-9a-f]{32}$/i.test(noDashes))
    return `${noDashes.slice(0, 8)}-${noDashes.slice(8, 12)}-${noDashes.slice(12, 16)}-${noDashes.slice(16, 20)}-${noDashes.slice(20, 32)}`;
  // URL: last path segment often contains the id (e.g. "Page-Title-abc123...")
  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://notion.so/${trimmed}`);
    const segments = url.pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1] || '';
    const idFromSegment = last.split('-').pop();
    if (idFromSegment && idFromSegment.length >= 32) {
      const hex = idFromSegment.slice(-32).replace(/-/g, '');
      if (/^[0-9a-f]{32}$/i.test(hex))
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
    }
    if (last.length >= 32) {
      const hex = last.replace(/-/g, '').slice(-32);
      if (/^[0-9a-f]{32}$/i.test(hex))
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
    }
  } catch (_) {}
  return null;
}

function getPlainText(block) {
  const key = block.type;
  const obj = block[key];
  if (!obj || !Array.isArray(obj.rich_text)) return '';
  return obj.rich_text.map((r) => r.plain_text || '').join('');
}

async function fetchBlockChildren(apiKey, blockId, indent = 0) {
  const lines = [];
  let cursor;
  do {
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`);
    url.searchParams.set('page_size', '100');
    if (cursor) url.searchParams.set('start_cursor', cursor);
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': NOTION_VERSION,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Notion API ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    const blocks = data.results || [];
    for (const block of blocks) {
      if (block.archived) continue;
      const type = block.type;
      const text = getPlainText(block).trim();
      const prefix = '  '.repeat(indent);
      switch (type) {
        case 'heading_1':
          lines.push(`${prefix}# ${text}`);
          break;
        case 'heading_2':
          lines.push(`${prefix}## ${text}`);
          break;
        case 'heading_3':
          lines.push(`${prefix}### ${text}`);
          break;
        case 'paragraph':
          if (text) lines.push(`${prefix}${text}`);
          break;
        case 'bulleted_list_item':
          lines.push(`${prefix}- ${text}`);
          break;
        case 'numbered_list_item':
          lines.push(`${prefix}1. ${text}`);
          break;
        case 'to_do':
          lines.push(`${prefix}- [ ] ${text}`);
          break;
        case 'toggle':
        case 'callout':
        case 'quote':
          lines.push(`${prefix}${text}`);
          break;
        case 'divider':
          lines.push(`${prefix}---`);
          break;
        case 'code':
          lines.push(`${prefix}\`\`\`\n${text}\n\`\`\``);
          break;
        case 'child_page':
          lines.push(`${prefix}**${(block.child_page || {}).title || 'Page'}**`);
          break;
        case 'unsupported':
          break;
        default:
          if (text) lines.push(`${prefix}${text}`);
      }
      if (block.has_children) {
        const childLines = await fetchBlockChildren(apiKey, block.id, indent + 1);
        lines.push(...childLines);
      }
    }
    cursor = data.next_cursor || null;
  } while (cursor);
  return lines;
}

function getPageTitle(page) {
  const props = page.properties || {};
  for (const key of Object.keys(props)) {
    const p = props[key];
    if (p && p.type === 'title' && Array.isArray(p.title))
      return p.title.map((t) => t.plain_text || '').join('').trim();
  }
  return 'Untitled';
}

async function main() {
  const input = process.argv[2];
  const pageId = extractPageId(input);
  if (!pageId) {
    console.error('Usage: node scripts/notion-fetch-page.mjs <page-id-or-notion-url>');
    process.exit(1);
  }

  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    console.error('NOTION_API_KEY is not set. Add it to .env or the environment.');
    process.exit(1);
  }

  const pageRes = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Notion-Version': NOTION_VERSION,
    },
  });

  if (!pageRes.ok) {
    const err = await pageRes.json().catch(() => ({}));
    console.error(err.message || `Notion API ${pageRes.status}: ${pageRes.statusText}`);
    process.exit(1);
  }

  const page = await pageRes.json();
  const title = getPageTitle(page);
  console.log('TITLE:', title);

  const bodyLines = await fetchBlockChildren(apiKey, pageId);
  console.log(bodyLines.join('\n'));
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
